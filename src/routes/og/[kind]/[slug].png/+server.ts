import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { error } from '@sveltejs/kit';
import { ogEntries, renderOgImage } from '$lib/server/og';
import type { RequestHandler } from './$types';

export const prerender = 'auto';

export const entries = () =>
	ogEntries
		// Existing cards are checked in, keeping routine builds fast. A newly
		// added piece of content is rendered automatically on its first build.
		.filter(
			({ kind, slug }) =>
				!existsSync(resolve(process.cwd(), 'static', 'og', kind, `${slug}.png`))
		)
		.map(({ kind, slug }) => ({ kind, slug }));

export const GET: RequestHandler = ({ params }) => {
	const entry = ogEntries.find(
		(candidate) => candidate.kind === params.kind && candidate.slug === params.slug
	);
	if (!entry) error(404, 'OG image not found');

	return new Response(Uint8Array.from(renderOgImage(entry)), {
		headers: {
			'content-type': 'image/png',
			'cache-control': 'public, max-age=31536000, immutable'
		}
	});
};
