import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import { codeToHtml } from 'shiki';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			// heading ids, so in-post anchors and old deep links keep working
			rehypePlugins: [rehypeSlug],
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
			handleHttpError: 'fail'
		}
	}
};

export default config;
