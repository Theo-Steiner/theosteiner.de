import type { Talk } from '$lib/types';

/**
 * Talks appear in the home "Lately" feed and on /contents.
 * Add new entries at the top (the feed sorts by date anyway).
 */
export const talks: Talk[] = [
	{
		title: 'Ultimate Guide to Building Web Components with Svelte',
		date: '2025-05-08',
		event: 'Svelte Summit Spring 2025',
		location: 'Barcelona',
		href: 'https://www.youtube.com/watch?v=lDWfdfTH3e8'
	}
];
