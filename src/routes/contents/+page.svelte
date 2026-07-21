<script lang="ts">
	import { getFeed } from '$lib/data.remote';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { SITE_URL } from '$lib/siteConfig';
	import FeedList from '$lib/components/FeedList.svelte';

	const feed = $derived(await getFeed());

	const types = ['all', 'blog', 'talk', 'podcast', 'bluesky'] as const;
	type Filter = (typeof types)[number];

	function readFilter(): Filter {
		const type = page.url.searchParams.get('type');
		return (types as readonly string[]).includes(type ?? '') ? (type as Filter) : 'all';
	}

	// synced to ?type= so the filter survives a browser-back from a post.
	// reading the query string is only allowed client-side on a prerendered
	// page, and /contents isn't remounted when only the query changes (e.g.
	// on back/forward), so this stays an effect rather than a one-shot read.
	let filter: Filter = $state('all');

	$effect(() => {
		filter = readFilter();
	});

	function setFilter(type: Filter) {
		const url = new URL(page.url);
		if (type === 'all') url.searchParams.delete('type');
		else url.searchParams.set('type', type);
		// a real (if history-replacing) navigation, not shallow routing —
		// pushState/replaceState from $app/navigation update the address bar
		// but deliberately leave `page.url` (and thus back/forward) alone
		goto(url, { replaceState: true, keepFocus: true, noScroll: true });
	}

	const items = $derived(feed.filter((item) => filter === 'all' || item.type === filter));
</script>

<svelte:head>
	<title>Everything — Theo Steiner</title>
	<meta
		name="description"
		content="Everything Theo Steiner has written, said or posted — essays, talks, podcasts and the occasional Bluesky post."
	/>
	<link rel="canonical" href="{SITE_URL}/contents" />
</svelte:head>

<header>
	<div class="heading">
		<h1>Everything I&rsquo;ve made.</h1>
		<span class="ja">全部</span>
	</div>
	<p>
		Essays, talks, podcast appearances, and the occasional Bluesky post I refuse to let die in the
		timeline.
	</p>
</header>

<div class="chips" role="group" aria-label="Filter by type">
	{#each types as type (type)}
		<button
			type="button"
			class="chip"
			class:active={filter === type}
			onclick={() => setFilter(type)}
		>
			{type}
		</button>
	{/each}
</div>

<section>
	{#if items.length === 0}
		<p class="empty">Nothing here yet. 🤷</p>
	{:else}
		<FeedList {items} withYear />
	{/if}
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
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--faint);
	}
	header p {
		margin: 14px 0 0;
		font-size: 16px;
		line-height: 1.7;
		color: var(--muted);
		text-wrap: pretty;
	}
	.chips {
		margin-top: 36px;
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.chip {
		font-family: var(--font-mono);
		font-size: 11.5px;
		padding: 5px 13px;
		border: 1px solid var(--hair);
		border-radius: var(--radius-round);
		cursor: pointer;
		background: transparent;
		color: var(--soft);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.chip:hover {
		border-color: var(--ink);
	}
	.chip.active {
		background: var(--yellow);
		color: #21201c;
		border-color: var(--yellow);
	}
	section {
		margin-top: 22px;
	}
	.empty {
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--muted);
		padding: 32px 0;
	}
</style>
