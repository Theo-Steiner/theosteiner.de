import { defineConfig } from 'void/config';

export default defineConfig({
	cloudflare: {
		name: 'theosteiner-de',
		account_id: 'c2e4bcc2d1e6af768d4f53906cac8731',
		compatibility_date: '2026-10-01',
		routes: [
			{ pattern: 'theosteiner.de', custom_domain: true },
			{ pattern: 'www.theosteiner.de', custom_domain: true }
		]
	},
	// The site is fully prerendered by adapter-static; deploy `build/` as-is.
	inference: {
		appType: 'static',
		outputDir: 'build'
	},
	routing: {
		redirects: {
			'https://www.theosteiner.de/*': { to: 'https://theosteiner.de/:splat', status: 301 },
			// old swyxkit-era RSS locations
			'/api/rss.xml': { to: '/rss.xml', status: 301 },
			'/feed': { to: '/rss.xml', status: 301 },
			'/rss': { to: '/rss.xml', status: 301 },
			// the old blog index
			'/blog': { to: '/contents', status: 301 }
		},
		headers: {
			'/*': [
				'X-Frame-Options: DENY',
				'X-Content-Type-Options: nosniff',
				'Cache-Control: public, max-age=4000',
				// in loving memory
				'X-Clacks-Overhead: GNU Terry Pratchett'
			],
			'/resume*': [
				'X-Robots-Tag: noindex, nofollow, noarchive',
				'Cache-Control: private, no-store',
				'Referrer-Policy: no-referrer'
			]
		}
	}
});
