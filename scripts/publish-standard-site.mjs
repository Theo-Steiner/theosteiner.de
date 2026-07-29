import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
	bskyPostRef,
	DID,
	ROOT,
	publicationUri,
	session,
	toText,
	xrpc
} from './lib/standard-site.mjs';

const requestedTarget = process.argv[2];
if (!requestedTarget) throw new Error('Usage: pnpm standard-site:publish <slug|all>');

const postsDir = path.join(ROOT, 'src/content/posts');
const uriMapPath = path.join(ROOT, 'src/content/standard-site-documents.json');
const uriMap = JSON.parse(await readFile(uriMapPath, 'utf8'));
const accessJwt = await session();
const site = await publicationUri();

function frontmatterValue(frontmatter, key) {
	const line = frontmatter.match(new RegExp(`^${key}:\\s*(.*?)\\s*$`, 'm'))?.[1];
	return line?.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, '$1$2');
}

function stringField(block, key) {
	const value = block.match(new RegExp(`^\\s*${key}:\\s*(["'])(.*?)\\1,?\\s*$`, 'm'));
	if (!value) return undefined;
	return value[1] === '"' ? JSON.parse(`"${value[2]}"`) : value[2];
}

function entriesFrom(source, kind) {
	return [...source.matchAll(/^\t\{\n([\s\S]*?)^\t\},?$/gm)]
		.map((match) => {
			const block = match[1];
			const title = stringField(block, 'title');
			const date = stringField(block, 'date');
			if (!title || !date) return undefined;
			const slug = stringField(block, 'slug') ?? slugify(title);
			const description = stringField(block, 'description');
			const event = stringField(block, 'event');
			return {
				slug,
				path: `/${kind}s/${slug}`,
				title,
				date,
				description,
				textContent: description ?? `${kind}: ${title}${event ? ` (${event})` : ''}`,
				tags: event ? [kind, event] : [kind],
				bskyThread: stringField(block, 'bskyThread')
			};
		})
		.filter(Boolean);
}

function slugify(text) {
	return text
		.normalize('NFKD')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/(^-|-$)/g, '');
}

async function publish(document, existingUri) {
	const record = {
		$type: 'site.standard.document',
		site,
		path: document.path,
		title: document.title,
		...(document.description ? { description: document.description } : {}),
		publishedAt: new Date(`${document.date}T00:00:00.000Z`).toISOString(),
		textContent: document.textContent,
		tags: document.tags,
		...(document.bskyThread ? { bskyPostRef: await bskyPostRef(document.bskyThread) } : {})
	};
	const create = async () => {
		const created = await xrpc(accessJwt, 'com.atproto.repo.createRecord', {
			repo: DID,
			collection: 'site.standard.document',
			record
		});
		return created.uri;
	};

	if (existingUri) {
		const match = existingUri.match(/^at:\/\/[^/]+\/site\.standard\.document\/([^/]+)$/);
		if (!match) throw new Error(`Invalid standardSiteUri: ${existingUri}`);
		try {
			await xrpc(accessJwt, 'com.atproto.repo.putRecord', {
				repo: DID,
				collection: 'site.standard.document',
				rkey: match[1],
				record
			});
			return existingUri;
		} catch (error) {
			if (!String(error).includes('RecordNotFound')) throw error;
			console.warn(`Replacing deleted Standard.site record for ${document.path}`);
			return create();
		}
	}

	return create();
}

async function posts() {
	const requestedSlugs = requestedTarget === 'all'
		? (await readdir(postsDir)).filter((filename) => filename.endsWith('.md')).map((filename) => filename.slice(0, -3))
		: [requestedTarget];
	for (const slug of requestedSlugs) {
		const filename = path.join(postsDir, `${slug}.md`);
		const source = await readFile(filename, 'utf8');
		const match = source.match(/^---\n([\s\S]*?)\n---/);
		if (!match) throw new Error(`${slug}.md has no frontmatter.`);
		const frontmatter = match[1];
		const title = frontmatterValue(frontmatter, 'title');
		const date = frontmatterValue(frontmatter, 'date');
		if (!title || !date) throw new Error(`${slug}.md needs title and date frontmatter.`);
		const tags = frontmatter.match(/^tags:\s*\[([^\]]*)\]/m)?.[1]
			.split(',').map((tag) => tag.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean) ?? [];
		const document = {
			path: `/${slug}`,
			title,
			date,
			description: frontmatterValue(frontmatter, 'description'),
			textContent: toText(source),
			tags,
			bskyThread: frontmatterValue(frontmatter, 'bskyThread')
		};
		const existingUri = frontmatterValue(frontmatter, 'standardSiteUri');
		const uri = await publish(document, existingUri);
		if (uri !== existingUri) {
			const updatedFrontmatter = existingUri
				? frontmatter.replace(/^standardSiteUri:\s*.*$/m, `standardSiteUri: "${uri}"`)
				: `${frontmatter}\nstandardSiteUri: "${uri}"`;
			await writeFile(filename, source.replace(frontmatter, updatedFrontmatter));
		}
		console.log(`Published ${document.path}: ${uri}`);
	}
}

async function detailPages() {
	if (requestedTarget !== 'all') return;
	const [talkSource, podcastSource, uitPodcastSource] = await Promise.all([
		readFile(path.join(ROOT, 'src/content/talks.ts'), 'utf8'),
		readFile(path.join(ROOT, 'src/content/podcasts.ts'), 'utf8'),
		readFile(path.join(ROOT, 'src/content/podcasts.uit.ts'), 'utf8')
	]);
	const podcastThreads = Object.fromEntries(
		[...podcastSource.matchAll(/"([^"\n]+)":\s*"(https:\/\/bsky\.app\/profile\/[^"\n]+)"/g)]
			.map(([, slug, thread]) => [slug, thread])
	);
	for (const document of [
		...entriesFrom(talkSource, 'talk'),
		...entriesFrom(podcastSource, 'podcast'),
		...entriesFrom(uitPodcastSource, 'podcast').map((document) => ({
			...document,
			bskyThread: document.bskyThread ?? podcastThreads[document.slug]
		}))
	]) {
		const uri = await publish(document, uriMap[document.path]);
		uriMap[document.path] = uri;
		console.log(`Published ${document.path}: ${uri}`);
	}
	await writeFile(uriMapPath, `${JSON.stringify(uriMap, null, '\t')}\n`);
}

await posts();
await detailPages();
