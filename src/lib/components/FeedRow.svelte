<script lang="ts">
	import type { FeedItem } from '$lib/types';

	let { item, date }: { item: FeedItem; date: string } = $props();
</script>

<a href={item.href} class="row">
	{#if item.isStatus}
		<span class="status">&ldquo;{item.text}&rdquo;</span>
	{:else}
		<span class="title">{item.text}</span>
	{/if}
	<span class="label">{item.type}</span>
	<span class="date">{date}</span>
</a>

<style>
	.row {
		display: flex;
		align-items: baseline;
		gap: 14px;
		padding: 13px 8px;
		margin: 0 -8px;
		text-decoration: none;
		border-radius: var(--radius-2);
		transition:
			background 0.2s,
			transform 0.25s var(--ease-slide);
	}
	.row:hover {
		background: var(--wash);
		transform: translateX(5px);
	}
	.title {
		flex: 1;
		font-size: 16px;
		font-weight: 500;
		color: var(--ink);
		letter-spacing: -0.01em;
		line-height: 1.5;
	}
	.status {
		flex: 1;
		font-size: 15.5px;
		font-family: var(--font-serif);
		font-style: italic;
		color: var(--muted);
		line-height: 1.5;
	}
	.label,
	.date {
		font-family: var(--font-mono);
		font-size: 11.5px;
		color: var(--faint);
	}
	.date {
		width: 72px;
		white-space: nowrap;
		text-align: right;
		flex: none;
	}
	@media (max-width: 480px) {
		.label {
			display: none;
		}
	}
</style>
