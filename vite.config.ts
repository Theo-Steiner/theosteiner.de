import { sveltekit } from '@sveltejs/kit/vite';
import svebcomponents from '@svebcomponents/ssr/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// Must precede sveltekit(): it wraps custom elements for declarative-shadow-
	// DOM rendering on the server, while the package's Svelte export conditions
	// provide the matching server and browser implementations.
	plugins: [svebcomponents(), sveltekit()]
});
