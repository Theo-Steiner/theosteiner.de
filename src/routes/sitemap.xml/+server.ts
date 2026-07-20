import { posts } from '$lib/server/content';
import { SITE_URL } from '$lib/siteConfig';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const pages = ['', '/contents', '/about', ...posts.map((post) => `/${post.slug}`)];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((path) => `	<url><loc>${SITE_URL}${path}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: { 'content-type': 'application/xml' }
	});
};
