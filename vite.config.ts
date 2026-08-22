import { sveltekit } from '@sveltejs/kit/vite';
import svebcomponents from '@svebcomponents/ssr/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// Must precede sveltekit(): it wraps custom elements for declarative-shadow-
	// DOM rendering on the server. The component ships one compiled custom
	// element build (no svelte export condition); its generated /ssr entry,
	// loaded in hooks.server.ts, registers the matching server renderer.
	plugins: [svebcomponents(), sveltekit()]
});
