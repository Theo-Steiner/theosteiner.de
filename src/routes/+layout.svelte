<script lang="ts">
	import '@fontsource-variable/instrument-sans/wght.css';
	import '@fontsource-variable/instrument-sans/wght-italic.css';
	import '@fontsource/instrument-serif/400.css';
	import '@fontsource/instrument-serif/400-italic.css';
	import '@fontsource/noto-sans-jp/japanese-400.css';
	import '@fontsource/noto-sans-jp/japanese-600.css';
	import '@fontsource-variable/geist-mono/wght.css';
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import NowPlayingBar from '$lib/components/NowPlayingBar.svelte';

	let { children } = $props();
	const isResume = $derived(page.route.id === '/resume');

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

{#if isResume}
	{@render children()}
{:else}
	<div class="page">
		<Nav />
		<main>
			{@render children()}
		</main>
		<Footer />
	</div>
	<NowPlayingBar />
{/if}
