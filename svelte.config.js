import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkFootnotes from 'remark-footnotes';
import { codeToHtml } from 'shiki';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			// Pandoc-style footnotes, including [^1] references.
			remarkPlugins: [remarkFootnotes],
			// Heading ids and links, so in-post anchors and old deep links keep working.
			rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
			highlight: {
				highlighter: async (code, lang) => {
					const html = await codeToHtml(code, {
						lang: lang ?? 'text',
						theme: 'vesper'
					}).catch(() => codeToHtml(code, { lang: 'text', theme: 'vesper' }));
					return `{@html \`${escapeSvelte(html)}\` }`;
				}
			}
		})
	],
	compilerOptions: {
		runes: true,
		experimental: { async: true }
	},
	// mdsvex still emits `context="module"` scripts; silence the deprecation noise
	onwarn: (warning, handler) => {
		if (warning.code === 'script_context_deprecated') return;
		handler(warning);
	},
	kit: {
		adapter: adapter(),
		experimental: {
			remoteFunctions: true
		},
		prerender: {
			handleHttpError: 'fail',
			// Standard.site verification uses valid at:// link relations, but those
			// are not URLs SvelteKit's static crawler can fetch.
			handleInvalidUrl: 'ignore'
		}
	}
};

export default config;
