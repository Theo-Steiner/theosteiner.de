<script lang="ts">
	import { ogImage, SITE_URL } from '$lib/siteConfig';
	import { longDate } from '$lib/format';
	import GitHubComments from '$lib/components/GitHubComments.svelte';
	import BskyComments from '$lib/components/BskyComments.svelte';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();

	const Content = $derived(data.content);
	const meta = $derived(data.meta);
	const pageUrl = $derived(
		meta.canonical?.startsWith('http')
			? meta.canonical
			: `${SITE_URL}${meta.canonical ?? `/${data.slug}`}`
	);
</script>

<Seo
	title={meta.title}
	description={meta.description}
	path={meta.canonical ?? `/${data.slug}`}
	image={ogImage('blog', data.slug)}
	type="article"
/>
<svelte:head>
	{#if meta.tags?.length}
		<meta name="keywords" content={meta.tags.join(', ')} />
	{/if}
</svelte:head>

<header>
	<a href="/contents?type=blog" class="back">&larr; blog</a>
	<h1 style:view-transition-name={`post-${data.slug}`}>{meta.title}</h1>
	<div class="meta">
		<span>{longDate(meta.date)}</span>
		<span>{data.readingTime}</span>
		<span>blog</span>
		{#if meta.reactions}
			<span class="hearts">&hearts; {meta.reactions}</span>
		{/if}
	</div>
</header>

<article class="prose">
	<Content />
</article>

{#if meta.githubIssue}
	<GitHubComments slug={data.slug} githubIssue={meta.githubIssue} reactions={meta.reactions} />
{/if}

{#if meta.bskyThread}
	<BskyComments thread={meta.bskyThread} {pageUrl} />
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
	.hearts {
		color: var(--red);
	}
	article {
		margin-top: 40px;
	}

	/* --- prose: styles for the rendered markdown ----------------------- */
	.prose :global(p) {
		margin: 16px 0 0;
		font-size: 17px;
		line-height: 1.75;
		color: var(--muted);
		text-wrap: pretty;
	}
	.prose :global(> :first-child) {
		margin-top: 0;
	}
	.prose :global(h1),
	.prose :global(h2) {
		margin: 48px 0 0;
		font-size: 21px;
		font-weight: 600;
		letter-spacing: -0.015em;
		line-height: 1.35;
		color: var(--ink);
	}
	.prose :global(h3) {
		margin: 36px 0 0;
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.prose :global(h1 + p),
	.prose :global(h2 + p),
	.prose :global(h3 + p) {
		margin-top: 14px;
	}
	.prose :global(h1 a),
	.prose :global(h2 a),
	.prose :global(h3 a) {
		color: inherit;
		background: none;
	}
	.prose :global(h1 a:hover::after),
	.prose :global(h2 a:hover::after),
	.prose :global(h3 a:hover::after) {
		content: ' #';
		font-family: var(--font-mono);
		font-size: 0.72em;
		font-weight: 500;
		color: var(--red);
	}
	.prose :global(a) {
		color: var(--ink);
		text-decoration: none;
		background-image: linear-gradient(var(--ghost), var(--ghost));
		background-repeat: no-repeat;
		background-position: 0 100%;
		background-size: 100% 1px;
	}
	.prose :global(a:hover) {
		background-image: linear-gradient(var(--ink), var(--ink));
	}
	.prose :global(em) {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 1.06em;
		color: var(--ink);
	}
	.prose :global(strong) {
		color: var(--ink);
	}
	.prose :global(code) {
		font-family: var(--font-mono);
		font-size: 14px;
		background: var(--codebg);
		padding: 1px 6px;
		border-radius: var(--radius-1);
		color: var(--ink);
	}
	.prose :global(pre) {
		margin: 20px 0 0;
		border: 1px solid var(--hair);
		background: var(--pre-bg) !important;
		font-family: var(--font-mono);
		font-size: 13.5px;
		line-height: 1.7;
		padding: 18px 20px;
		border-radius: var(--radius-2);
		overflow-x: auto;
	}
	.prose :global(pre code) {
		background: none;
		padding: 0;
		font-size: inherit;
		color: inherit;
	}
	.prose :global(ul),
	.prose :global(ol) {
		margin: 16px 0 0;
		padding-left: 24px;
		font-size: 17px;
		line-height: 1.75;
		color: var(--muted);
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.prose :global(li::marker) {
		color: var(--faint);
	}
	.prose :global(blockquote) {
		margin: 20px 0 0;
		padding: 2px 0 2px 18px;
		border-left: 3px solid var(--yellow);
	}
	.prose :global(blockquote p) {
		margin: 0;
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 17px;
		line-height: 1.7;
	}
	.prose :global(img) {
		height: auto;
		max-width: 100%;
		border-radius: var(--radius-2);
	}
	.prose :global(hr) {
		margin: 40px 0;
		border: 0;
		border-top: 1px solid var(--hair);
	}

</style>
