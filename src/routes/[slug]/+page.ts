import { error } from '@sveltejs/kit';
import { loadPost } from '$lib/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, data }) => {
	const module = await loadPost(params.slug);
	if (!module) error(404, 'Post not found');
	return {
		...data,
		slug: params.slug,
		content: module.default,
		meta: module.metadata
	};
};
