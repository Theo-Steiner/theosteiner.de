import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

export const ROOT = path.resolve(import.meta.dirname, '../..');
export const PDS = 'https://eurosky.social';
export const DID = 'did:plc:nsmlf6uhdg2onrsrdr7oiyv4';
export const PUBLICATION_CONFIG = path.join(ROOT, 'src/lib/standardSite.ts');

async function loadEnv() {
	try {
		const source = await readFile(path.join(ROOT, '.env'), 'utf8');
		for (const line of source.split(/\r?\n/)) {
			const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
			if (match && !process.env[match[1]]) {
				process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
			}
		}
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
	}
}

export async function session() {
	await loadEnv();
	const identifier = process.env.ATPROTO_HANDLE;
	const password = process.env.ATPROTO_APP_PASSWORD;
	if (!identifier || !password) {
		throw new Error('Set ATPROTO_HANDLE and ATPROTO_APP_PASSWORD in .env first.');
	}

	const response = await fetch(`${PDS}/xrpc/com.atproto.server.createSession`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ identifier, password })
	});
	if (!response.ok) throw new Error(`Could not sign in: ${await response.text()}`);
	const value = await response.json();
	if (value.did !== DID) {
		throw new Error(`Expected ${DID}, but signed in as ${value.did}.`);
	}
	return value.accessJwt;
}

export async function xrpc(accessJwt, method, body) {
	const response = await fetch(`${PDS}/xrpc/${method}`, {
		method: 'POST',
		headers: {
			authorization: `Bearer ${accessJwt}`,
			'content-type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	if (!response.ok) throw new Error(`${method} failed: ${await response.text()}`);
	return response.json();
}

export async function publicationUri() {
	const source = await readFile(PUBLICATION_CONFIG, 'utf8');
	const match = source.match(/STANDARD_SITE_PUBLICATION_URI: string \| undefined = ['"]([^'"]+)['"]/);
	if (!match) {
		throw new Error('Create the publication first with pnpm standard-site:create-publication.');
	}
	return match[1];
}

export async function setPublicationUri(uri) {
	const source = await readFile(PUBLICATION_CONFIG, 'utf8');
	const updated = source.replace(
		/STANDARD_SITE_PUBLICATION_URI: string \| undefined = (?:undefined|['"][^'"]+['"]);/,
		`STANDARD_SITE_PUBLICATION_URI: string | undefined = '${uri}';`
	);
	if (updated === source) throw new Error('Could not save the publication URI.');
	await writeFile(PUBLICATION_CONFIG, updated);
	const verificationPath = path.join(ROOT, 'static/.well-known/site.standard.publication');
	await mkdir(path.dirname(verificationPath), { recursive: true });
	await writeFile(verificationPath, `${uri}\n`);
}

export function toText(markdown) {
	return markdown
		.replace(/^---[\s\S]*?---\s*/, '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/!?(\[[^\]]*\])\([^)]*\)/g, '$1')
		.replace(/[`*_>#]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}
