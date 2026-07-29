export interface PostMeta {
	title: string;
	date: string;
	description?: string;
	tags?: string[];
	image?: string;
	canonical?: string;
	/** total GitHub reaction count, frozen at migration time */
	reactions?: number;
	/** the archived swyxkit GitHub issue this post was migrated from */
	githubIssue?: string;
	/** at:// URI or bsky.app URL of the Bluesky post that hosts this post's comment thread */
	bskyThread?: string;
}

export interface Talk {
	title: string;
	date: string;
	description?: string;
	/** conference / meetup name */
	event: string;
	location?: string;
	duration?: string;
	/** recording or slides */
	href: string;
	/** overrides the auto-generated (slugified-title) detail-page slug */
	slug?: string;
}

export interface PodcastAppearance {
	title: string;
	date: string;
	/** episode page */
	href: string;
	/** direct audio file; enables the player on the episode's detail page */
	audioSrc?: string;
	/** WebVTT transcript URL; when present the player shows captions synced to playback */
	subtitlesSrc?: string;
	/** overrides the auto-generated (slugified-title) detail-page slug */
	slug?: string;
	/** at:// URI or bsky.app URL of the Bluesky post that hosts this episode's discussion */
	bskyThread?: string;
}

export interface BlueskyStatus {
	text: string;
	date: string;
	href: string;
	likes?: number;
	reposts?: number;
}

export type FeedType = 'blog' | 'talk' | 'podcast' | 'bluesky';

export interface FeedItem {
	type: FeedType;
	date: string;
	href: string;
	/** row headline (blog/talk/podcast title, or the status text for bluesky) */
	text: string;
	/** bluesky statuses render in serif italic quotes */
	isStatus: boolean;
	/** longer description, shown on detail-ish surfaces */
	description?: string;
	/** e.g. "15 minutes · 6 ♥" or "Svelte Summit · 東京 Tokyo" */
	meta?: string;
	/** local detail-page slug (blog/talk/podcast); absent for bluesky */
	slug?: string;
}

export interface ArchivedComment {
	author: string;
	avatar: string | null;
	url: string;
	profileUrl: string;
	date: string;
	/** sanitized, immutable HTML generated when the GitHub archive is imported */
	bodyHtml: string;
	reactions: number;
}
