<script lang="ts">
	import { SITE_URL } from '$lib/siteConfig';
	import { longDate } from '$lib/format';
	import { youtubeId } from '$lib/youtube';

	let { data } = $props();
	const talk = $derived(data.talk);
	const embedId = $derived(youtubeId(talk.href));
</script>

<svelte:head>
	<title>{talk.title} — Theo Steiner</title>
	{#if talk.description}
		<meta name="description" content={talk.description} />
	{/if}
	<link rel="canonical" href="{SITE_URL}/talks/{talk.slug}" />
	<meta property="og:title" content={talk.title} />
	<meta property="og:type" content="video.other" />
</svelte:head>

<header>
	<a href="/contents?type=talk" class="back">&larr; everything</a>
	<h1 style:view-transition-name={`talk-${talk.slug}`}>{talk.title}</h1>
	<div class="meta">
		<span>{longDate(talk.date)}</span>
		<span>{talk.event}</span>
		{#if talk.location}<span>{talk.location}</span>{/if}
		{#if talk.duration}<span>{talk.duration}</span>{/if}
	</div>
</header>

{#if talk.description}
	<p class="description">{talk.description}</p>
{/if}

{#if embedId}
	<div class="embed">
		<iframe
			src="https://www.youtube-nocookie.com/embed/{embedId}"
			title={talk.title}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowfullscreen
			loading="lazy"
		></iframe>
	</div>
{:else}
	<a class="pill" href={talk.href} target="_blank" rel="noopener">Watch the talk &rarr;</a>
{/if}

<style>
	header {
		margin-top: 72px;
	}
	.back {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--faint);
		text-decoration: none;
		transition: color 0.2s;
	}
	.back:hover {
		color: var(--red);
	}
	h1 {
		margin: 18px 0 0;
		font-size: 30px;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.3;
		text-wrap: pretty;
	}
	.meta {
		margin-top: 14px;
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--faint);
	}
	.description {
		margin: 40px 0 0;
		font-size: 17px;
		line-height: 1.75;
		color: var(--muted);
		text-wrap: pretty;
	}
	.embed {
		margin-top: 40px;
		position: relative;
		aspect-ratio: 16 / 9;
		border-radius: var(--radius-2);
		overflow: hidden;
		background: var(--codebg);
	}
	.embed iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 40px;
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 500;
		color: #21201c;
		background: var(--yellow);
		border-radius: var(--radius-round);
		padding: 9px 18px;
		text-decoration: none;
		transition: transform 0.25s var(--ease-pop);
	}
	.pill:hover {
		transform: scale(1.05) rotate(-1deg);
	}
	.pill:active {
		transform: scale(0.96);
	}
</style>
