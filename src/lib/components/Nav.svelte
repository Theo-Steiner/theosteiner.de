<script lang="ts">
	import { page } from '$app/state';
	import Logo from './Logo.svelte';

	// the logo lives in the greeting on the home page, so the nav hides it there
	const isHome = $derived(page.route.id === '/');
</script>

<nav class:home={isHome}>
	{#if !isHome}
		<a href="/" aria-label="Home" class="logo"><Logo /></a>
	{/if}
	<div class="links">
		<a
			href="/contents"
			class="link-marker"
			aria-current={page.route.id === '/contents' ? 'page' : undefined}>contents</a
		>
		<a
			href="/about"
			class="link-marker"
			aria-current={page.route.id === '/about' ? 'page' : undefined}>about</a
		>
		<a class="social-link" href="https://github.com/Theo-Steiner" aria-label="GitHub">
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					fill="currentColor"
					d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.683-.217.683-.483 0-.237-.009-1.025-.013-1.86-2.782.604-3.369-1.18-3.369-1.18-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.635-1.337-2.221-.253-4.556-1.111-4.556-4.944 0-1.092.39-1.985 1.029-2.685-.103-.253-.446-1.271.098-2.65 0 0 .84-.269 2.75 1.026A9.57 9.57 0 0 1 12 6.756a9.57 9.57 0 0 1 2.504.337c1.909-1.295 2.748-1.026 2.748-1.026.546 1.379.203 2.397.1 2.65.64.7 1.028 1.593 1.028 2.685 0 3.842-2.339 4.688-4.566 4.936.359.31.678.92.678 1.855 0 1.34-.012 2.42-.012 2.75 0 .268.18.58.688.482A10.002 10.002 0 0 0 22 12c0-5.523-4.477-10-10-10Z"
				/>
			</svg>
		</a>
		<a class="social-link bluesky-flutter" href="https://bsky.app/profile/theosteiner.de" aria-label="Bluesky">
			<svg viewBox="0 0 566 500" aria-hidden="true">
				<defs>
					<path
						id="wing"
						fill="currentColor"
						d="M123.244 35.008C188.248 83.809 283.836 176.879 283.836 235.857c0 81.042.043-.012 0 140.181.053-.043-1.166.506-3.624 7.72-13.406 39.353-65.725 192.927-185.371 70.155-62.998-64.644-33.828-129.288 80.841-148.805-65.602 11.166-139.35-7.281-159.589-79.604C10.271 204.699.343 76.56.343 59.246c0-86.697 75.999-59.452 122.901-24.238Z"
					/>
				</defs>
				<use href="#wing" class="left" />
				<use href="#wing" class="right" />
			</svg>
		</a>
	</div>
</nav>

<style>
	nav {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		font-size: 15px;
	}
	nav.home {
		justify-content: flex-end;
	}
	.logo {
		color: var(--ink);
		display: inline-block;
		line-height: 1;
		transition: transform 0.3s var(--ease-pop);
		view-transition-name: logo;
	}
	.logo:hover {
		transform: rotate(-2deg) scale(1.04);
	}
	.links {
		display: flex;
		align-items: baseline;
		gap: 26px;
	}
	.social-link {
		color: var(--soft);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		/* Inline SVGs synthesize a baseline at their bottom edge. Move their
		   optical center onto Instrument Sans's 0.51em x-height center. */
		transform: translateY(calc(8px - 0.255em));
		transition: color 0.2s;
	}
	.social-link:hover {
		color: var(--ink);
	}
	.social-link svg {
		display: block;
		width: 16px;
		height: 16px;
	}
	.bluesky-flutter .left {
		transform-origin: center;
	}
	.bluesky-flutter .right {
		transform-origin: center;
		transform: scale(-1, 1);
	}
	.bluesky-flutter:hover .left,
	.bluesky-flutter:focus-visible .left {
		animation: flutter 430ms ease-in-out;
		--flip: 1;
	}
	.bluesky-flutter:hover .right,
	.bluesky-flutter:focus-visible .right {
		animation: flutter 500ms ease-in-out;
		--flip: -1;
	}
	.bluesky-flutter:hover svg,
	.bluesky-flutter:focus-visible svg {
		transform: rotate(-5deg);
		transition: transform 500ms;
	}
	@media (prefers-reduced-motion: reduce) {
		.bluesky-flutter:hover .left,
		.bluesky-flutter:focus-visible .left,
		.bluesky-flutter:hover .right,
		.bluesky-flutter:focus-visible .right {
			animation: none;
		}
	}
	@keyframes flutter {
		10% { transform: scale(calc(var(--flip) * 1), 0.9); }
		20% { transform: scale(calc(var(--flip) * 0.5), 1); }
		40% { transform: scale(calc(var(--flip) * 0.9), 0.95); }
		60% { transform: scale(calc(var(--flip) * 0.3), 1); }
		80% { transform: scale(calc(var(--flip) * 0.9), 0.95); }
		100% { transform: scale(calc(var(--flip) * 1), 1); }
	}
</style>
