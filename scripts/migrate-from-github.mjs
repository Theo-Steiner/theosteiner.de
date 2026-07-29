/**
 * One-time migration: exports published blog posts and their comments from
 * the swyxkit GitHub-issues backend (Theo-Steiner/v1-theosteiner.de) into this
 * repo, so the site has no runtime or build-time GitHub dependency.
 *
 *   posts    → src/content/posts/<slug>.md   (frontmatter + markdown body)
 *   comments → src/content/comments/<slug>.json
 *   avatars  → static/avatars/<login>.webp
 *
 * Usage: node scripts/migrate-from-github.mjs
 * Idempotent: re-running overwrites the exported files.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { renderCommentHtml } from './lib/render-comment-html.mjs';

const REPO = 'Theo-Steiner/v1-theosteiner.de';
const ROOT = new URL('..', import.meta.url).pathname;
const POSTS_DIR = path.join(ROOT, 'src/content/posts');
const COMMENTS_DIR = path.join(ROOT, 'src/content/comments');
const AVATARS_DIR = path.join(ROOT, 'static/avatars');

const headers = {
	accept: 'application/vnd.github+json',
	...(process.env.GH_TOKEN ? { authorization: `token ${process.env.GH_TOKEN}` } : {})
};

/** identical to the old site's slugify so URLs are preserved */
function slugify(text) {
	return text
		.toString()
		.normalize('NFKD')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/(^-|-$)/g, '');
}

function parseFrontmatter(src) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src);
	if (!match) return { data: {}, content: src };
	const data = {};
	for (const line of match[1].split(/\r?\n/)) {
		const idx = line.indexOf(':');
		if (idx === -1) continue;
		const key = line.slice(0, idx).trim();
		let value = line.slice(idx + 1).trim();
		if (value.startsWith('[')) value = JSON.parse(value.replace(/'/g, '"'));
		else value = value.replace(/^["']|["']$/g, '');
		data[key] = value;
	}
	return { data, content: src.slice(match[0].length) };
}

function yaml(value) {
	if (Array.isArray(value)) return `[${value.map((v) => JSON.stringify(v)).join(', ')}]`;
	if (typeof value === 'number') return String(value);
	return JSON.stringify(value);
}

async function gh(url) {
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
	return res.json();
}

await mkdir(POSTS_DIR, { recursive: true });
await mkdir(COMMENTS_DIR, { recursive: true });
await mkdir(AVATARS_DIR, { recursive: true });

const issues = await gh(
	`https://api.github.com/repos/${REPO}/issues?state=all&labels=Published&per_page=100&creator=${REPO.split('/')[0]}`
);
console.log(`found ${issues.length} published posts`);

const avatarPaths = new Map();
async function downloadAvatar(user) {
	if (avatarPaths.has(user.login)) return avatarPaths.get(user.login);
	const rel = `/avatars/${user.login}.webp`;
	const res = await fetch(`${user.avatar_url}&s=96`);
	if (res.ok) {
		await writeFile(path.join(AVATARS_DIR, `${user.login}.webp`), Buffer.from(await res.arrayBuffer()));
		avatarPaths.set(user.login, rel);
		return rel;
	}
	console.warn(`could not download avatar for ${user.login}`);
	avatarPaths.set(user.login, null);
	return null;
}

for (const issue of issues) {
	// svelte templates reject `</br>` (void element with closing tag)
	const { data, content } = parseFrontmatter(
		issue.body
			.replaceAll('\r\n', '\n')
			.replaceAll('</br>', '<br/>')
			// emoji-style ™️ leaves an invisible variation selector in heading slugs
			.replaceAll('™️', '™')
	);
	const title = data.title ?? issue.title;
	const slug = (data.slug ?? slugify(title)).toString().toLowerCase();
	const date = data.date ?? issue.created_at.slice(0, 10);

	const fm = {
		title,
		date,
		...(data.description ? { description: data.description } : {}),
		...(data.tags ? { tags: data.tags } : {}),
		...(data.image ? { image: data.image } : {}),
		...(data.canonical ? { canonical: data.canonical } : {}),
		reactions: issue.reactions.total_count,
		githubIssue: issue.html_url
	};
	const frontmatter = Object.entries(fm)
		.map(([k, v]) => `${k}: ${yaml(v)}`)
		.join('\n');
	await writeFile(path.join(POSTS_DIR, `${slug}.md`), `---\n${frontmatter}\n---\n\n${content.trim()}\n`);

	const raw = issue.comments > 0 ? await gh(`${issue.comments_url}?per_page=100`) : [];
	const comments = [];
	for (const c of raw) {
		comments.push({
			author: c.user.login,
			avatar: await downloadAvatar(c.user),
			url: c.html_url,
			profileUrl: c.user.html_url,
			date: c.created_at,
			bodyHtml: renderCommentHtml(c.body.replaceAll('\r\n', '\n')),
			reactions: c.reactions.total_count
		});
	}
	await writeFile(path.join(COMMENTS_DIR, `${slug}.json`), JSON.stringify(comments, null, '\t') + '\n');
	console.log(`✓ ${slug} (${comments.length} comments, ${issue.reactions.total_count} reactions)`);
}
console.log('done');
