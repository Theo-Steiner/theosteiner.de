/** returns the video id if `href` is a youtube.com/watch or youtu.be link, else null */
export function youtubeId(href: string): string | null {
	try {
		const url = new URL(href);
		if (url.hostname === 'youtu.be') return url.pathname.slice(1) || null;
		if (url.hostname.endsWith('youtube.com')) return url.searchParams.get('v');
	} catch {
		// not a valid URL — not a youtube link either
	}
	return null;
}
