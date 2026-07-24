import type { PodcastAppearance } from '$lib/types';
import { uitPodcasts } from './podcasts.uit';

/**
 * Podcast appearances appear in the home "Lately" feed and on /contents.
 * `audioSrc` (a direct mp3/m4a URL) enables the inline player; without it
 * the row is a plain link to `href`. `subtitlesSrc` is optional and enables
 * synced captions when the episode has a WebVTT transcript — it must be a
 * same-origin path (e.g. `/transcripts/episode.vtt`, downloaded into
 * static/transcripts/), since the player fetches it client-side and most
 * transcript hosts don't send the CORS headers a cross-origin fetch needs.
 *
 * UIT INSIDE episodes (transcripts included) are imported by
 * `pnpm import:podcasts`; add other appearances manually below.
 */
export const podcasts: PodcastAppearance[] = [
	// {
	// 	title: 'Svelte Radio — Being a Svelte Ambassador in Japan',
	// 	date: '2023-11-02',
	// 	href: 'https://www.svelteradio.com/',
	// 	audioSrc: 'https://example.com/episode.mp3',
	// 	subtitlesSrc: '/transcripts/svelte-radio-japan.vtt'
	// }
	...uitPodcasts
];
