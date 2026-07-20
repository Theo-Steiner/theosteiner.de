import { error } from '@sveltejs/kit';
import { posts } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const post = posts.find((candidate) => candidate.slug === params.slug);
	if (!post) error(404, 'Post not found');
	return { readingTime: post.readingTime };
};

export const entries = () => posts.map((post) => ({ slug: post.slug }));
