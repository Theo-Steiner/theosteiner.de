import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DID, ROOT, publicationUri, session, toText, xrpc } from './lib/standard-site.mjs';

const requestedSlug = process.argv[2];
if (!requestedSlug) throw new Error('Usage: pnpm standard-site:publish <slug|all>');

const postsDir = path.join(ROOT, 'src/content/posts');
const slugs = requestedSlug === 'all'
	? (await readdir(postsDir))
		.filter((filename) => filename.endsWith('.md'))
		.map((filename) => filename.slice(0, -3))
	: [requestedSlug];
const accessJwt = await session();
const site = await publicationUri();

for (const slug of slugs) {
	const filename = path.join(postsDir, `${slug}.md`);
	const source = await readFile(filename, 'utf8');
const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
if (!frontmatter) throw new Error(`${slug}.md has no frontmatter.`);

const value = (key) => {
	const line = frontmatter[1].match(new RegExp(`^${key}:\\s*(.*?)\\s*$`, 'm'))?.[1];
	return line?.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, '$1$2');
};
const tags = frontmatter[1].match(/^tags:\s*\[([^\]]*)\]/m)?.[1]
	.split(',')
	.map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
	.filter(Boolean) ?? [];
const title = value('title');
const date = value('date');
if (!title || !date) throw new Error('A Standard.site document needs title and date frontmatter.');

const existingUri = value('standardSiteUri');
const record = {
	$type: 'site.standard.document',
	site,
	path: `/${slug}`,
	title,
	description: value('description'),
	publishedAt: new Date(`${date}T00:00:00.000Z`).toISOString(),
	textContent: toText(source),
	tags
};

let uri = existingUri;
if (existingUri) {
	const match = existingUri.match(/^at:\/\/[^/]+\/site\.standard\.document\/([^/]+)$/);
	if (!match) throw new Error(`Invalid standardSiteUri: ${existingUri}`);
	await xrpc(accessJwt, 'com.atproto.repo.putRecord', {
		repo: DID,
		collection: 'site.standard.document',
		rkey: match[1],
		record
	});
} else {
	const created = await xrpc(accessJwt, 'com.atproto.repo.createRecord', {
		repo: DID,
		collection: 'site.standard.document',
		record
	});
	uri = created.uri;
	const updatedFrontmatter = `${frontmatter[1]}\nstandardSiteUri: "${uri}"`;
	await writeFile(filename, source.replace(frontmatter[1], updatedFrontmatter));
}

console.log(`Published ${slug}: ${uri}`);
}
