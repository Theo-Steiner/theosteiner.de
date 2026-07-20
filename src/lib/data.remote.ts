import { prerender } from '$app/server';
import { buildFeed, commentsFor, posts } from '$lib/server/content';

/**
 * The unified cross-media feed (blog, talks, podcasts, bluesky).
 * Prerendered at build time; the client gets static JSON.
 */
export const getFeed = prerender(async () => buildFeed());

/**
 * Archived GitHub comments for a post, markdown already rendered to HTML.
 * Prerendered for every post slug at build time.
 */
export const getComments = prerender(
	'unchecked',
	async (slug: string) => commentsFor(slug),
	{ inputs: () => posts.map((post) => post.slug) }
);
