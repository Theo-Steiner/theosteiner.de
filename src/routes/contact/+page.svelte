<script lang="ts">
	import { BLUESKY_URL, GITHUB_URL, LINKEDIN_URL, X_URL, ogImage } from '$lib/siteConfig';
	import Seo from '$lib/components/Seo.svelte';

	const BLUESKY_WING =
		'M123.244 35.008C188.248 83.809 283.836 176.879 283.836 235.857c0 81.042.043-.012 0 140.181.053-.043-1.166.506-3.624 7.72-13.406 39.353-65.725 192.927-185.371 70.155-62.998-64.644-33.828-129.288 80.841-148.805-65.602 11.166-139.35-7.281-159.589-79.604C10.271 204.699.343 76.56.343 59.246c0-86.697 75.999-59.452 122.901-24.238Z';

	const channels = [
		{ name: 'Bluesky', handle: '@theosteiner.de', href: BLUESKY_URL },
		{ name: 'X', handle: '@_TheoSteiner', href: X_URL },
		{ name: 'GitHub', handle: 'Theo-Steiner', href: GITHUB_URL },
		{ name: 'LinkedIn', handle: 'Theodor Steiner', href: LINKEDIN_URL }
	];
</script>

<Seo
	title="Contact"
	description="Where to find Theo Steiner: Bluesky, X, GitHub and LinkedIn."
	path="/contact"
	image={ogImage('page', 'contact')}
/>

<header>
	<div class="heading">
		<h1>Contact</h1>
		<span class="ja">連絡先</span>
	</div>
	<p>Want to chat? Here's where to find me.</p>
</header>

<ul>
	{#each channels as { name, handle, href } (name)}
		<li>
			<a {href} rel="me noopener" target="_blank">
				<svg class="logo" viewBox={name === 'Bluesky' ? '0 0 566 500' : '0 0 24 24'} role="img" aria-label={name}>
					{#if name === 'Bluesky'}
						<path class="wing left" fill="currentColor" d={BLUESKY_WING} />
						<path class="wing right" fill="currentColor" d={BLUESKY_WING} />
					{:else if name === 'X'}
						<path
							fill="currentColor"
							d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
						/>
					{:else if name === 'GitHub'}
						<path
							fill="currentColor"
							d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.683-.217.683-.483 0-.237-.009-1.025-.013-1.86-2.782.604-3.369-1.18-3.369-1.18-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.635-1.337-2.221-.253-4.556-1.111-4.556-4.944 0-1.092.39-1.985 1.029-2.685-.103-.253-.446-1.271.098-2.65 0 0 .84-.269 2.75 1.026A9.57 9.57 0 0 1 12 6.756a9.57 9.57 0 0 1 2.504.337c1.909-1.295 2.748-1.026 2.748-1.026.546 1.379.203 2.397.1 2.65.64.7 1.028 1.593 1.028 2.685 0 3.842-2.339 4.688-4.566 4.936.359.31.678.92.678 1.855 0 1.34-.012 2.42-.012 2.75 0 .268.18.58.688.482A10.002 10.002 0 0 0 22 12c0-5.523-4.477-10-10-10Z"
						/>
					{:else}
						<path
							fill="currentColor"
							d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.948 1.637-1.84 3.37-1.84 3.601 0 4.267 2.37 4.267 4.981v6.299ZM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"
						/>
					{/if}
				</svg>
				<span class="handle">{handle}</span>
				<span class="arrow" aria-hidden="true">↗</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	header {
		margin-top: 72px;
	}
	.heading {
		display: flex;
		align-items: baseline;
		gap: 14px;
	}
	h1 {
		margin: 0;
		font-size: 26px;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.25;
	}
	.ja {
		font-family: var(--font-ja);
		font-size: 14px;
		font-weight: 400;
		letter-spacing: 0.02em;
		color: var(--faint);
	}
	header p {
		margin: 12px 0 0;
		font-size: 17px;
		line-height: 1.75;
		color: var(--muted);
	}
	ul {
		margin: 32px 0 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--hair);
	}
	li {
		border-bottom: 1px solid var(--hair);
	}
	a {
		display: flex;
		align-items: baseline;
		gap: 16px;
		padding: 16px 0;
		color: var(--ink);
		text-decoration: none;
	}
	.logo {
		flex: none;
		align-self: center;
		width: 20px;
		height: 20px;
		color: var(--soft);
		transition: color 0.2s;
	}
	.handle {
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--muted);
		transition: color 0.2s;
	}
	.arrow {
		margin-left: auto;
		color: var(--faint);
		transition:
			color 0.2s,
			transform 0.3s var(--ease-pop);
	}
	a:hover .logo {
		color: var(--ink);
	}
	.wing {
		transform-origin: center;
	}
	.wing.right {
		transform: scale(-1, 1);
	}
	a:hover .wing.left,
	a:focus-visible .wing.left {
		animation: flutter 430ms ease-in-out;
		--flip: 1;
	}
	a:hover .wing.right,
	a:focus-visible .wing.right {
		animation: flutter 500ms ease-in-out;
		--flip: -1;
	}
	@media (prefers-reduced-motion: reduce) {
		a:hover .wing,
		a:focus-visible .wing {
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
	a:hover .handle,
	a:hover .arrow {
		color: var(--red);
	}
	a:hover .arrow {
		transform: translate(2px, -2px);
	}
</style>
