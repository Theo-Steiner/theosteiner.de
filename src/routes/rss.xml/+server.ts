import { posts } from '$lib/server/content';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '$lib/siteConfig';
import type { RequestHandler } from './$types';

export const prerender = true;

function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export const GET: RequestHandler = () => {
	const items = posts
		.map(
			(post) => `		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${SITE_URL}/${post.slug}</link>
			<guid isPermaLink="true">${SITE_URL}/${post.slug}</guid>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			${post.description ? `<description>${escapeXml(post.description)}</description>` : ''}
		</item>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escapeXml(SITE_TITLE)}</title>
		<link>${SITE_URL}</link>
		<description>${escapeXml(SITE_DESCRIPTION)}</description>
		<language>en</language>
		<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
	</channel>
</rss>`;

	return new Response(xml, {
		headers: { 'content-type': 'application/xml' }
	});
};
