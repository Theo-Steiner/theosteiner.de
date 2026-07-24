import { sveltekit } from '@sveltejs/kit/vite';
import svebcomponents from '@svebcomponents/ssr/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// Must precede sveltekit(): during SSR it renders <atproto-comments> into
	// declarative shadow DOM (server build) and hands the browser the client
	// build for hydration. Async wrapper is auto-detected from svelte's
	// experimental.async.
	plugins: [svebcomponents(), sveltekit()]
});
