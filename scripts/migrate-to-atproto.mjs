import { readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const POSTS_DIR = new URL('../src/content/posts/', import.meta.url);
const SITE_URL = (process.env.SITE_URL ?? 'https://theosteiner.de').replace(/\/$/, '');
const PDS_URL = (process.env.ATPROTO_PDS_URL ?? 'https://bsky.social').replace(/\/$/, '');
const shouldPublish = process.argv.includes('--publish');
const shouldReplace = process.argv.includes('--replace-existing');

function quotedYamlValue(value) {
	return JSON.stringify(value);
}

function parsePost(filename, source) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) throw new Error(`${filename}: missing YAML frontmatter`);

	const frontmatter = match[1];
	const getString = (key) => {
		const value = frontmatter.match(new RegExp(`^${key}:\\s*["'](.+?)["']\\s*$`, 'm'))?.[1];
		if (!value) throw new Error(`${filename}: missing ${key}`);
		return value;
	};

	return {
		filename,
		source,
		frontmatter,
		frontmatterEnd: match[0].length,
		slug: basename(filename, '.md'),
		title: getString('title'),
		date: getString('date'),
		bskyThread: frontmatter.match(/^bskyThread:\s*["'](.+?)["']\s*$/m)?.[1]
	};
}

function postText(post) {
	return `Comments for “${post.title}”\nOriginally published ${post.date}\n${SITE_URL}/${post.slug}`;
}

function linkFacet(text, uri) {
	const byteStart = Buffer.byteLength(text.slice(0, text.indexOf(uri)));
	return {
		$type: 'app.bsky.richtext.facet',
		index: {
			byteStart,
			byteEnd: byteStart + Buffer.byteLength(uri)
		},
		features: [{ $type: 'app.bsky.richtext.facet#link', uri }]
	};
}

async function xrpc(path, body, accessJwt) {
	const response = await fetch(`${PDS_URL}/xrpc/${path}`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			...(accessJwt ? { authorization: `Bearer ${accessJwt}` } : {})
		},
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		const detail = await response.text();
		throw new Error(`${path} failed (${response.status}): ${detail}`);
	}

	return response.json();
}

async function createSession() {
	const identifier = process.env.ATPROTO_IDENTIFIER;
	const password = process.env.ATPROTO_APP_PASSWORD;
	if (!identifier || !password) {
		throw new Error(
			'Set ATPROTO_IDENTIFIER and ATPROTO_APP_PASSWORD in .env before using --publish.'
		);
	}

	return xrpc('com.atproto.server.createSession', { identifier, password });
}

function addThreadToFrontmatter(post, uri) {
	const line = `bskyThread: ${quotedYamlValue(uri)}`;
	let nextFrontmatter;

	if (/^bskyThread:/m.test(post.frontmatter)) {
		nextFrontmatter = post.frontmatter.replace(/^bskyThread:.*$/m, line);
	} else {
		nextFrontmatter = `${post.frontmatter}\n${line}`;
	}

	return `---\n${nextFrontmatter}\n---${post.source.slice(post.frontmatterEnd)}`;
}

const filenames = (await readdir(POSTS_DIR))
	.filter((filename) => filename.endsWith('.md'))
	.sort();
const posts = await Promise.all(
	filenames.map(async (filename) =>
		parsePost(filename, await readFile(join(POSTS_DIR.pathname, filename), 'utf8'))
	)
);
const candidates = posts.filter((post) => shouldReplace || !post.bskyThread);

if (candidates.length === 0) {
	console.log('No posts need an ATProto comment root.');
	process.exit(0);
}

console.log(shouldPublish ? 'Publishing these comment roots:' : 'Dry run — would publish:');
for (const post of candidates) {
	console.log(`\n${post.filename}${post.bskyThread ? ' (replace existing thread)' : ''}`);
	console.log(postText(post));
	console.log(`createdAt: ${post.date}T12:00:00.000Z`);
}

if (!shouldPublish) {
	console.log('\nNothing was published. Re-run with --publish after reviewing this list.');
	process.exit(0);
}

const session = await createSession();
for (const post of candidates) {
	if (post.bskyThread?.startsWith(`at://${session.did}/app.bsky.feed.post/`)) {
		console.log(`Skipped ${post.filename}: it already uses a thread owned by ${session.did}`);
		continue;
	}

	const text = postText(post);
	const articleUrl = `${SITE_URL}/${post.slug}`;
	const result = await xrpc(
		'com.atproto.repo.createRecord',
		{
			repo: session.did,
			collection: 'app.bsky.feed.post',
			validate: true,
			record: {
				$type: 'app.bsky.feed.post',
				text,
				facets: [linkFacet(text, articleUrl)],
				langs: ['en'],
				createdAt: `${post.date}T12:00:00.000Z`
			}
		},
		session.accessJwt
	);

	await writeFile(join(POSTS_DIR.pathname, post.filename), addThreadToFrontmatter(post, result.uri));
	console.log(`Published ${post.filename}: ${result.uri}`);
}
