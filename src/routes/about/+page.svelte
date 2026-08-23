<script lang="ts">
	import { ogImage } from '$lib/siteConfig';
	import portrait from '$lib/assets/theo_steiner.webp';
	import Seo from '$lib/components/Seo.svelte';
	import Bio from '../../content/about.md';
</script>

<Seo
	title="About"
	description="Theo Steiner is a frontend engineer in Tokyo, Svelte Ambassador, and organizer of the Svelte community in Japan."
	path="/about"
	image={ogImage('page', 'about')}
/>

<header>
	<div class="heading">
		<h1>Who?!</h1>
		<span class="ja">自己紹介</span>
	</div>
</header>

<section class="bio">
	<div class="portrait">
		<img src={portrait} alt="Theo Steiner" width="172" height="172" />
		<span class="caption">me, allegedly</span>
	</div>
	<Bio />
</section>

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
	.bio {
		margin-top: 32px;
	}
	.portrait {
		float: right;
		margin: 6px 0 16px 24px;
		position: relative;
	}
	.portrait img {
		width: 172px;
		height: 172px;
		object-fit: cover;
		border-radius: var(--radius-2);
		display: block;
		transition: transform 0.3s var(--ease-pop);
	}
	.portrait:hover img {
		transform: rotate(2deg) scale(1.03);
	}
	.caption {
		position: absolute;
		left: 8px;
		bottom: -9px;
		font-family: var(--font-mono);
		font-size: 10.5px;
		color: #21201c;
		background: var(--yellow);
		padding: 2px 8px;
		border-radius: var(--radius-1);
	}
	.bio :global(p) {
		margin: 0;
		font-size: 17px;
		line-height: 1.75;
		color: var(--muted);
		text-wrap: pretty;
	}
	.bio :global(p + p) {
		margin-top: 16px;
	}
	.bio :global(h2) {
		margin: 40px 0 0;
		font-size: 21px;
		font-weight: 600;
		letter-spacing: -0.015em;
		line-height: 1.35;
		color: var(--ink);
	}
	.bio :global(.mono-inline) {
		font-family: var(--font-mono);
		font-size: 15px;
	}
	.bio :global(em) {
		font-style: italic;
		color: var(--ink);
	}
	.bio :global(a) {
		color: var(--ink);
		text-decoration: none;
		background-image: linear-gradient(var(--ghost), var(--ghost));
		background-repeat: no-repeat;
		background-position: 0 100%;
		background-size: 100% 1px;
	}
	.bio :global(a:hover) {
		background-image: linear-gradient(var(--ink), var(--ink));
	}
	.bio :global(code) {
		font-family: var(--font-mono);
		font-size: 14px;
		background: var(--codebg);
		padding: 1px 6px;
		border-radius: var(--radius-1);
		color: var(--ink);
	}
	@media (max-width: 480px) {
		.portrait {
			float: none;
			margin: 0 0 20px;
		}
	}
</style>
