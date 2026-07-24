<script lang="ts">
	import { SITE_URL } from '$lib/siteConfig';
	import { longDate } from '$lib/format';
	import PodcastPlayer from '$lib/components/PodcastPlayer.svelte';
	import PodcastTranscript from '$lib/components/PodcastTranscript.svelte';
	import { podcastPlayer } from '$lib/podcast-player.svelte';

	let { data } = $props();
	const podcast = $derived(data.podcast);

	// if nothing is playing anywhere, quietly load this episode into the
	// miniplayer (paused) so its controls and transcript sync are ready without
	// an explicit "Play episode" click. Leaves an already-active episode alone.
	$effect(() => {
		if (podcast.audioSrc && !podcastPlayer.src) {
			podcastPlayer.open({ src: podcast.audioSrc, title: podcast.title }, { autoplay: false });
		}
	});
</script>

<svelte:head>
	<title>{podcast.title} — Theo Steiner</title>
	<link rel="canonical" href="{SITE_URL}/podcasts/{podcast.slug}" />
	<meta property="og:title" content={podcast.title} />
	<meta property="og:type" content="music.song" />
</svelte:head>

<header>
	<a href="/contents?type=podcast" class="back">&larr; everything</a>
	<h1 style:view-transition-name={`podcast-${podcast.slug}`}>{podcast.title}</h1>
	<div class="meta">
		<span>{longDate(podcast.date)}</span>
		<span>podcast</span>
	</div>
</header>

<div class="actions">
	{#if podcast.audioSrc}
		<PodcastPlayer src={podcast.audioSrc} title={podcast.title} />
	{/if}
	<a class="pill" href={podcast.href} target="_blank" rel="noopener">Listen on the original site &rarr;</a>
</div>

{#if podcast.audioSrc && podcast.subtitlesSrc}
	<PodcastTranscript src={podcast.audioSrc} title={podcast.title} subtitlesSrc={podcast.subtitlesSrc} />
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
	.actions {
		margin-top: 32px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 500;
		color: #21201c;
		background: var(--yellow);
		border-radius: var(--radius-round);
		padding: 11px 20px;
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
