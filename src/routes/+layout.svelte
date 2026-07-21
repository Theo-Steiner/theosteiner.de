<script lang="ts">
	import '@fontsource-variable/instrument-sans/wght.css';
	import '@fontsource-variable/instrument-sans/wght-italic.css';
	import '@fontsource-variable/newsreader/opsz-italic.css';
	import '@fontsource-variable/geist-mono/wght.css';
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	// animate client-side navigations with the View Transitions API
	// https://svelte.dev/blog/view-transitions
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class="page">
	<Nav />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>
