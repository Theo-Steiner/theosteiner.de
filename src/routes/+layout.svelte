<script lang="ts">
	import '@fontsource-variable/instrument-sans/wght.css';
	import '@fontsource-variable/instrument-sans/wght-italic.css';
	import '@fontsource-variable/newsreader/opsz-italic.css';
	import '@fontsource-variable/geist-mono/wght.css';
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<div class="page">
	<Nav />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>
