import type { PodcastAppearance, PodcastTranscript } from "$lib/types";
import { uitPodcasts } from "./podcasts.uit";

// Kept outside the generated UIT import so `pnpm import:podcasts` preserves
// the discussion threads discovered from Theo's public PDS.
const uitThreads: Record<string, string> = {
  "uit-inside-188":
    "https://bsky.app/profile/theosteiner.de/post/3mmt4b2hm6k2p",
  "uit-inside-185":
    "https://bsky.app/profile/theosteiner.de/post/3mj2mpseqts22",
  "uit-inside-180":
    "https://bsky.app/profile/theosteiner.de/post/3lzqa7vc2cs2c",
  "uit-inside-173":
    "https://bsky.app/profile/theosteiner.de/post/3lrciewcptc27",
  "uit-inside-165":
    "https://bsky.app/profile/theosteiner.de/post/3laxua47dpc2v",
  "uit-inside-164":
    "https://bsky.app/profile/theosteiner.de/post/3l7syd2lr5y2g",
};

const uitVideos: Record<string, string> = {
  "uit-inside-192": "https://www.youtube.com/watch?v=z3cWUJHbRbM"
};

// The importer supplies each available English VTT. Keep hand-authored
// translations here so refreshing that generated data cannot erase them.
const uitTranscripts: Record<string, PodcastTranscript[]> = {
  "uit-inside-192": [
    { label: "English", src: "/transcripts/uit-inside-192.vtt" },
    { label: "日本語", src: "/transcripts/uit-inside-192-ja.vtt" }
  ]
};

/**
 * Podcast appearances appear in the home "Lately" feed and on /contents.
 * `audioSrc` (a direct mp3/m4a URL) enables the inline player; without it
 * the row is a plain link to `href`. `transcripts` enables synced captions
 * when an episode has one or more WebVTT tracks — they must be
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
  // 	transcripts: [{ label: 'English', src: '/transcripts/svelte-radio-japan.vtt' }]
  // }
  ...uitPodcasts.map((podcast) => ({
    ...podcast,
    bskyThread: podcast.bskyThread ?? (podcast.slug ? uitThreads[podcast.slug] : undefined),
    videoHref: podcast.slug ? uitVideos[podcast.slug] : undefined,
    transcripts: podcast.slug ? (uitTranscripts[podcast.slug] ?? podcast.transcripts) : podcast.transcripts,
  })),
];
