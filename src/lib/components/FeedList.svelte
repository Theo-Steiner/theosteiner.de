<script lang="ts">
	import type { FeedItem } from '$lib/types';
	import { shortDate } from '$lib/format';
	import FeedRow from './FeedRow.svelte';

	let { items, withYear = false }: { items: FeedItem[]; withYear?: boolean } = $props();
</script>

<div class="list">
	{#each items as item (item.href + item.date)}
		<div class="item">
			<FeedRow {item} date={shortDate(item.date, withYear)} />
		</div>
	{/each}
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid var(--hair);
	}
	.item {
		border-top: 1px solid var(--hair);
	}
</style>
