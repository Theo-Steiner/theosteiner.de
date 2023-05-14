<script>
	// href={item.slug} title={item.data.title} date={item.data.date}
	export let href = '#';
	/** @type {import('$lib/types').ContentItem} */
	export let item = undefined;
	/** @type {import('$lib/types').GHMetadata} */
	export let ghMetadata = null;
	export let title = 'Untitled post';
	/** @type {string} */
	export let stringData = 'no date';
</script>

<a class="w-full text-gray-800 dark:text-gray-200" {href}
	><div class="mb-8 w-full">
		<div class="flex flex-col justify-between md:flex-row">
			<h4 class="mb-2 w-full flex-auto text-lg font-medium md:text-xl">
				{title}
			</h4>
		</div>
		<p class="break-all text-gray-600 dark:text-gray-400 sm:break-words">
			<slot />
		</p>
		<div
			class="flex justify-between gap-1 text-left text-gray-500 sm:flex-row sm:justify-start sm:gap-4 md:mb-0 md:text-sm"
		>
			<!-- {JSON.stringify(item.readingTime)} -->
			<p>{stringData}</p>
			{#if item?.readingTime}
				<p class="hidden sm:inline-block">{item?.readingTime}</p>
			{/if}
			{#if ghMetadata && ghMetadata.reactions.total_count}
				<p class="">{ghMetadata.reactions.total_count} ♥</p>
			{/if}
			<!-- comment this in if you have multiple categories -->
			<!-- <button class="px-4 capitalize bg-gray-200 rounded-xl dark:bg-gray-700 dark:text-gray-400"
				>{item?.category || 'blog'}</button
			> -->
		</div>
	</div></a
>
