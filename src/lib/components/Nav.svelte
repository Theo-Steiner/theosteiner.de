<script lang="ts">
	import { page } from '$app/state';
	import Logo from './Logo.svelte';

	// the logo lives in the greeting on the home page, so the nav hides it there
	const isHome = $derived(page.route.id === '/');
</script>

<nav class:home={isHome}>
	{#if !isHome}
		<a href="/" aria-label="Home" class="logo"><Logo height={16} /></a>
	{/if}
	<div class="links">
		<a
			href="/contents"
			class="link-marker"
			aria-current={page.route.id === '/contents' ? 'page' : undefined}>Contents</a
		>
		<a
			href="/about"
			class="link-marker"
			aria-current={page.route.id === '/about' ? 'page' : undefined}>About</a
		>
	</div>
</nav>

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	nav.home {
		justify-content: flex-end;
	}
	.logo {
		color: var(--ink);
		display: block;
		transition: transform 0.3s var(--ease-pop);
		view-transition-name: logo;
	}
	.logo:hover {
		transform: rotate(-2deg) scale(1.04);
	}
	.links {
		display: flex;
		gap: 26px;
		font-size: 13.5px;
	}
</style>
