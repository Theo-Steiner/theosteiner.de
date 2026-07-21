import { error } from '@sveltejs/kit';
import { podcastEntries } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const podcast = podcastEntries.find((candidate) => candidate.slug === params.slug);
	if (!podcast) error(404, 'Episode not found');
	return { podcast };
};

export const entries = () => podcastEntries.map((podcast) => ({ slug: podcast.slug }));
