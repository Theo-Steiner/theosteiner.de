<script lang="ts">
	import type { FeedItem } from '$lib/types';
	import { PodcastPlayerState, formatPlaybackTime } from '$lib/podcast-player.svelte';

	let { item, date }: { item: FeedItem; date: string } = $props();

	const player = new PodcastPlayerState(item.audioSrc ?? '');
</script>

<div class="row">
	<button
		type="button"
		class="play"
		onclick={player.toggle}
		aria-label={player.playing ? 'Pause' : 'Play'}
		disabled={!item.audioSrc}
	>
		{#if player.playing}
			<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<rect x="6" y="5" width="4" height="14" rx="1" />
				<rect x="14" y="5" width="4" height="14" rx="1" />
			</svg>
		{:else}
			<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M6 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 6 4.5z" />
			</svg>
		{/if}
	</button>
	<div class="body">
		<a
			href={item.href}
			class="title"
			style:view-transition-name={item.slug ? `podcast-${item.slug}` : undefined}>{item.text}</a
		>
		{#if player.started}
			<div class="scrubber">
				<span class="time">{formatPlaybackTime(player.current)}</span>
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div
					class="track"
					onclick={player.seek}
					role="slider"
					aria-label="Seek"
					aria-valuenow={player.progress}
					tabindex="-1"
				>
					<div class="fill" style:width="{player.progress}%"></div>
				</div>
				<span class="time right">{formatPlaybackTime(player.duration)}</span>
			</div>
		{/if}
	</div>
	<span class="label">podcast</span>
	<span class="date">{date}</span>
	{#if item.audioSrc}
		<audio
			bind:this={player.audio}
			src={item.audioSrc}
			preload="none"
			ontimeupdate={player.onTime}
			onloadedmetadata={player.onMeta}
			onended={player.onEnded}
		></audio>
	{/if}
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 14px 10px;
		margin: 0 -10px;
		border-radius: var(--radius-2);
		transition: background 0.2s;
	}
	.row:hover {
		background: var(--wash);
	}
	.play {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: var(--radius-round);
		border: 1px solid var(--hair);
		box-sizing: border-box;
		cursor: pointer;
		background: transparent;
		color: var(--faint);
		transition:
			color 0.2s,
			border-color 0.2s,
			background 0.2s,
			transform 0.25s var(--ease-pop);
	}
	.play:hover {
		border-color: var(--yellow);
		background: var(--wash);
		color: var(--ink);
		transform: scale(1.08);
	}
	.play:active {
		transform: scale(0.92);
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	.title {
		display: inline-block;
		font-size: 16px;
		font-weight: 500;
		color: var(--ink);
		letter-spacing: -0.01em;
		line-height: 1.5;
		text-decoration: none;
		background-image: linear-gradient(var(--ink), var(--ink));
		background-repeat: no-repeat;
		background-position: 0 100%;
		background-size: 0% 1px;
		transition: background-size 0.3s;
	}
	.title:hover {
		background-size: 100% 1px;
	}
	.scrubber {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 9px;
	}
	.time {
		font-family: var(--font-mono);
		font-size: 10.5px;
		color: var(--faint);
		min-width: 2.8em;
	}
	.time.right {
		text-align: right;
	}
	.track {
		flex: 1;
		height: 3px;
		border-radius: var(--radius-round);
		background: var(--hair);
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: var(--radius-round);
		background: var(--red);
	}
	.label,
	.date {
		font-family: var(--font-mono);
		font-size: 11.5px;
		color: var(--faint);
		flex: none;
	}
	.date {
		width: 72px;
		white-space: nowrap;
		text-align: right;
	}
	@media (max-width: 480px) {
		.label {
			display: none;
		}
	}
</style>
