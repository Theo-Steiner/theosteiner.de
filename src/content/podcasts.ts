import type { PodcastAppearance } from '$lib/types';
import { uitPodcasts } from './podcasts.uit';

/**
 * Podcast appearances appear in the home "Lately" feed and on /contents.
 * `audioSrc` (a direct mp3/m4a URL) enables the inline player; without it
 * the row is a plain link to `href`.
 *
 * UIT INSIDE episodes are imported by `pnpm import:podcasts`; add other
 * appearances manually below.
 */
export const podcasts: PodcastAppearance[] = [
	// {
	// 	title: 'Svelte Radio — Being a Svelte Ambassador in Japan',
	// 	date: '2023-11-02',
	// 	href: 'https://www.svelteradio.com/',
	// 	audioSrc: 'https://example.com/episode.mp3'
	// }
	...uitPodcasts
];
