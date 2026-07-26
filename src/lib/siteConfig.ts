export const SITE_URL = 'https://theosteiner.de';
export const SITE_TITLE = 'Theo Steiner';
export const SITE_DESCRIPTION = "Theo Steiner's personal website & blog";
export const ogImage = (kind: 'page' | 'blog' | 'talk' | 'podcast', slug: string) =>
	`${SITE_URL}/og/${kind}/${slug}.png`;
export const DEFAULT_OG_IMAGE = ogImage('page', 'home');
export const GITHUB_URL = 'https://github.com/Theo-Steiner';
export const BLUESKY_URL = 'https://bsky.app/profile/theosteiner.de';
