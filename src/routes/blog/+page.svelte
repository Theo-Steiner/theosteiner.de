<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { queryParam } from 'sveltekit-search-params';

	import { SITE_TITLE, POST_CATEGORIES } from '$lib/siteConfig';

	import IndexCard from '../../components/IndexCard.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	// technically this is a slighlty different type because doesnt have 'content' but we'll let it slide
	/** @type {import('$lib/types').ContentItem[]} */
	$: items = data.items;

	let selectedCategories = queryParam('show', {
		encode: (arr) => arr?.toString(),
		decode: (str) => str?.split(',')?.filter((e) => e) ?? []
	});
	let search = queryParam('filter');
	let inputEl;

	function focusSearch(e) {
		if (e.key === '/' && inputEl) inputEl.select();
	}

	let isTruncated = items?.length > 20;
	$: list = items
		.filter((item) => {
			if ($selectedCategories?.length) {
				return $selectedCategories
					.map((element) => {
						return element.toLowerCase();
					})
					.includes(item.category.toLowerCase());
			}
			return true;
		})
		.filter((item) => {
			if ($search) {
				const searchSummary = `${item.title.toLowerCase()} ${item.description} ${item.tags.concat(
					' '
				)}`;
				return searchSummary.includes($search.toLowerCase());
			}
			return true;
		})
		.slice(0, isTruncated ? 2 : items.length);
</script>

<svelte:head>
	<title>{SITE_TITLE} Blog Index</title>
	<meta name="description" content={`Latest ${SITE_TITLE} posts`} />
</svelte:head>

<svelte:window on:keyup={focusSearch} />

<section class="mx-auto mb-16 flex max-w-2xl flex-col items-start justify-center px-4 sm:px-8">
	<h1 class="mb-4 text-3xl font-bold tracking-tight dark:text-yellow-400 md:text-5xl">Blog</h1>
	<p class="mb-4 text-gray-600 dark:text-gray-400">
		So far, I've written {items.length} articles on my blog. Use the search below to filter by title.
	</p>
	<div class="relative mb-4 w-full">
		<input
			aria-label="Search articles"
			type="text"
			bind:value={$search}
			bind:this={inputEl}
			placeholder="Hit / to search"
			class="block w-full rounded-md border border-gray-200 bg-gray-800 px-4 py-2 text-gray-100 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
		/><svg
			class="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/></svg
		>
	</div>

	<!-- if you have multiple categories enabled -->
	{#if POST_CATEGORIES.length > 1}
		<div class="mt-2 mb-12 flex items-center ">
			<div class="mr-2 text-gray-900 dark:text-gray-400">Filter:</div>
			<div class="grid grid-cols-3 rounded-md shadow-sm sm:grid-cols-6">
				{#each POST_CATEGORIES as availableCategory}
					<div>
						<input
							id="category-{availableCategory}"
							class="peer sr-only"
							type="checkbox"
							bind:group={$selectedCategories}
							value={availableCategory}
						/>
						<label
							for="category-{availableCategory}"
							class="inline-flex w-full cursor-pointer items-center justify-between border border-gray-200 bg-white px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-purple-600 peer-checked:text-purple-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-purple-500"
						>
							{availableCategory}
						</label>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- you can hardcode yourmost popular posts or pinned post here if you wish -->
	<!-- {#if !$search} -->
	<!-- 	<h3 class="mt-8 mb-4 text-2xl font-bold tracking-tight dark:text-yellow-400 md:text-4xl"> -->
	<!-- 		Most Popular -->
	<!-- 	</h3> -->
	<!-- 	<IndexCard href="/welcome" title="Welcome to swyxkit!" stringData="123,456 views"> -->
	<!-- 		This is swyx's preferred starter for Svelte projects! -->
	<!-- 	</IndexCard> -->

	<!-- 	<h3 class="mt-8 mb-4 text-2xl font-bold tracking-tight dark:text-yellow-400 md:text-4xl"> -->
	<!-- 		All Posts -->
	<!-- 	</h3> -->
	<!-- {/if} -->

	{#if list.length}
		<ul class="">
			{#each list as item}
				<li class="mb-8 text-lg">
					<!-- <code class="mr-4">{item.data.date}</code> -->
					<IndexCard
						href={item.slug}
						title={item.title}
						stringData={new Date(item.date).toISOString().slice(0, 10)}
						ghMetadata={item.ghMetadata}
						{item}
					>
						{item.description}
					</IndexCard>
				</li>
			{/each}
		</ul>
		{#if isTruncated}
			<div class="flex justify-center">
				<button
					on:click={() => (isTruncated = false)}
					class="inline-block rounded bg-blue-100 p-4 text-lg font-bold tracking-tight text-gray-900 hover:text-yellow-900 dark:bg-blue-900 dark:text-yellow-400 hover:dark:text-yellow-200 md:text-2xl"
				>
					Load More Posts...
				</button>
			</div>
		{/if}
	{:else if $search}
		<div class="prose dark:prose-invert">
			No posts found for
			<code>{$search}</code>.
		</div>
		<button class="bg-slate-500 p-2" on:click={() => ($search = '')}>Clear your search</button>
	{:else}
		<div class="prose dark:prose-invert">No blogposts found!</div>
	{/if}
</section>
