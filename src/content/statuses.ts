import type { BlueskyStatus } from '$lib/types';

/**
 * Hand-picked Bluesky posts that refuse to die in the timeline.
 * Once the atproto backend (svebcomponent-bsky) lands these can be fetched
 * from the PDS instead — same shape, different source.
 */
export const statuses: BlueskyStatus[] = [
	// {
	// 	text: 'shipped a 4-line PR to Svelte today and I am going to be insufferable about it for at least a week 🎉',
	// 	date: '2023-09-28',
	// 	href: 'https://bsky.app/profile/theosteiner.de/post/…',
	// 	likes: 73,
	// 	reposts: 14
	// }
];
