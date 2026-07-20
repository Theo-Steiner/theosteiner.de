<script lang="ts">
	import { getFeed } from '$lib/data.remote';
	import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL, DEFAULT_OG_IMAGE } from '$lib/siteConfig';
	import Logo from '$lib/components/Logo.svelte';
	import FeedList from '$lib/components/FeedList.svelte';

	// async Svelte: awaited straight in the component, resolved at prerender time
	const items = $derived((await getFeed()).slice(0, 6));
</script>

<svelte:head>
	<title>{SITE_TITLE}</title>
	<meta name="description" content={SITE_DESCRIPTION} />
	<link rel="canonical" href={SITE_URL} />
	<meta property="og:title" content={SITE_TITLE} />
	<meta property="og:description" content={SITE_DESCRIPTION} />
	<meta property="og:image" content={DEFAULT_OG_IMAGE} />
</svelte:head>

<header>
	<div class="greeting">
		<h1>
			<span>Hey, I&rsquo;m</span>
			<span class="wordmark"><Logo height={20} /></span><span class="period">.</span>
		</h1>
		<span class="ja">こんにちは。</span>
	</div>
	<p>
		I build frontends in Tokyo and care an unreasonable amount about the trip
		<span class="mark">from your browser to your editor</span>
		&mdash; Svelte things, developer tools, and one four-line PR I will never stop mentioning.
	</p>
	<p>
		The editor is <em class="serif">neovim</em>, obviously. The Japanese is a work in progress. The
		<em class="serif">onigiri</em> intake is world-class.
	</p>
</header>

<section>
	<div class="kicker">
		<h2>Lately</h2>
		<span class="kicker-ja">最近</span>
	</div>
	<div class="feed">
		<FeedList {items} />
	</div>
	<a href="/contents" class="link-marker more">Everything I&rsquo;ve made &rarr;</a>
</section>

<style>
	header {
		margin-top: 96px;
	}
	.greeting {
		display: flex;
		align-items: baseline;
		gap: 14px;
		flex-wrap: wrap;
	}
	h1 {
		margin: 0;
		font-size: 26px;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.25;
		display: flex;
		align-items: baseline;
		gap: 9px;
	}
	.wordmark {
		display: inline-flex;
		transform: translateY(1px);
		transition: transform 0.3s var(--ease-pop);
	}
	.wordmark:hover {
		transform: translateY(1px) rotate(-2deg) scale(1.04);
	}
	.period {
		margin-left: -6px;
	}
	.ja {
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--faint);
	}
	header p {
		margin: 18px 0 0;
		font-size: 17px;
		line-height: 1.75;
		color: var(--muted);
		text-wrap: pretty;
	}
	header p + p {
		margin-top: 14px;
	}
	section {
		margin-top: 80px;
	}
	.feed {
		margin-top: 18px;
	}
	.more {
		display: inline-block;
		margin-top: 20px;
		font-size: 14px;
		padding-bottom: 2px;
	}
</style>
