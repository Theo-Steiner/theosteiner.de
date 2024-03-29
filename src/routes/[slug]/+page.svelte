<script>
	import { DEFAULT_OG_IMAGE, MY_TWITTER_HANDLE, SITE_URL } from '$lib/siteConfig';

	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import Reactions from '../../components/Reactions.svelte';
	import { page } from '$app/stores';
	import utterances, { injectScript } from '$lib/utterances';

	/** @type {import('./$types').PageData} */
	export let data;
	let commentsEl;

	/** @type {import('$lib/types').ContentItem} */
	$: json = data.json; // warning: if you try to destructure content here, make sure to make it reactive, or your page content will not update when your user navigates

	$: canonical = SITE_URL + $page.url.pathname;
	$: issueNumber = json?.ghMetadata?.issueUrl?.split('/')?.pop();
</script>

<svelte:head>
	<title>{json.title}</title>
	<meta name="description" content={json.frontmatter.description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={json.title} />
	<meta name="Description" content={json.description} />
	<meta property="og:description" content={json.description} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content={'@' + MY_TWITTER_HANDLE} />
	<meta name="twitter:title" content={json.title} />
	<meta name="twitter:description" content={json.description} />
	<meta property="og:image" content={json.image || DEFAULT_OG_IMAGE} />
	<meta name="twitter:image" content={json.image || DEFAULT_OG_IMAGE} />
</svelte:head>

<article
	class="swyxcontent prose mx-auto mt-16 mb-32 w-full max-w-none items-start justify-center dark:prose-invert"
>
	<h1
		class="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-yellow-400 md:text-5xl "
	>
		{json.title}
	</h1>
	<div
		class="bg border-red mt-2 flex w-full justify-between sm:flex-col sm:items-start md:flex-row md:items-center"
	>
		<a href="/about" class="flex items-center text-sm text-gray-700 dark:text-gray-300"
			>Theo-Steiner</a
		>
		<p class="min-w-32 flex items-center text-sm text-gray-600 dark:text-gray-400 md:mt-0">
			<a href={json.ghMetadata.issueUrl} rel="external" class="no-underline" target="_blank">
				<span class="mr-4 font-mono text-xs text-gray-700 text-opacity-70 dark:text-gray-300"
					>{json.ghMetadata.reactions.total_count} reactions</span
				>
			</a>
			{new Date(json.date).toISOString().slice(0, 10)}
		</p>
	</div>
	<div
		class="-mx-4 my-2 flex h-1 w-[100vw] bg-gradient-to-r from-yellow-400 via-logo-red to-gray-400/50 sm:mx-0 sm:w-full"
	/>
	{@html json.content}
	<!-- <div class="swyxcontent prose mt-16 mb-32 w-full max-w-none flex-row dark:prose-invert">
	</div> -->
</article>
<div>
	<div class="align-center prose flex max-w-none flex-col gap-2 p-4 text-center dark:prose-invert">
		{#if json.ghMetadata.reactions.total_count > 0}
			Reactions: <Reactions
				issueUrl={json.ghMetadata.issueUrl}
				reactions={json.ghMetadata.reactions}
			/>
		{:else}
			<a href={json.ghMetadata.issueUrl}>Leave a reaction </a>
			if you liked this post! 🧡
		{/if}
		{#if issueNumber}
			<div
				class="mb-8 text-black dark:text-white "
				bind:this={commentsEl}
				use:utterances={{ number: issueNumber }}
			>
				Loading comments...
				<!-- svelte-ignore a11y-mouse-events-have-key-events -->
				<button
					class="my-4 rounded-lg bg-blue-200 p-2 text-black hover:bg-blue-100"
					on:click={() => injectScript(commentsEl, issueNumber)}
					on:mouseover={() => injectScript(commentsEl, issueNumber)}>Load now</button
				>
				<!-- <Comments ghMetadata={json.ghMetadata} /> -->
			</div>
		{/if}
	</div>
</div>

<style>
	/* https://ryanmulligan.dev/blog/layout-breakouts/ */
	.swyxcontent {
		--gap: clamp(1rem, 6vw, 3rem);
		--full: minmax(var(--gap), 1fr);
		/* --content: min(65ch, 100% - var(--gap) * 2); */
		--content: 65ch;
		--popout: minmax(0, 2rem);
		--feature: minmax(0, 5rem);

		display: grid;
		grid-template-columns:
			[full-start] var(--full)
			[feature-start] 0rem
			[popout-start] 0rem
			[content-start] var(--content) [content-end]
			[popout-end] 0rem
			[feature-end] 0rem
			var(--full) [full-end];
	}

	@media (min-width: 768px) {
		.swyxcontent {
			grid-template-columns:
				[full-start] var(--full)
				[feature-start] var(--feature)
				[popout-start] var(--popout)
				[content-start] var(--content) [content-end]
				var(--popout) [popout-end]
				var(--feature) [feature-end]
				var(--full) [full-end];
		}
	}

	:global(.swyxcontent > *) {
		grid-column: content;
	}

	article :global(pre) {
		grid-column: feature;
		margin-left: -1rem;
		margin-right: -1rem;
	}

	article :global(.popout) {
		grid-column: popout;
	}
	article :global(.feature) {
		grid-column: feature;
	}
	article :global(.full) {
		grid-column: full;
		width: 100%;
	}

	article :global(.admonition) {
		@apply border-4 border-red-500 p-8;
	}
</style>
