import { error } from '@sveltejs/kit';
import { talkEntries } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const talk = talkEntries.find((candidate) => candidate.slug === params.slug);
	if (!talk) error(404, 'Talk not found');
	return { talk };
};

export const entries = () => talkEntries.map((talk) => ({ slug: talk.slug }));
