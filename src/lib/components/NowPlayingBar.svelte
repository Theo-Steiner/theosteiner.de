<script lang="ts">
	import { podcastPlayer, formatPlaybackTime } from '$lib/podcast-player.svelte';
	import { page } from '$app/state';

	// the detail page silently reopens (paused) whenever nothing's loaded, so on
	// that page "closing" would just flash away and reappear — hide it there
	const canClose = $derived(page.route.id !== '/podcasts/[slug]');
</script>

<!-- the one <audio> element for the whole site — lives in the root layout so it
     survives client-side navigation instead of being torn down with the page -->
<audio
	bind:this={podcastPlayer.audio}
	preload="none"
	ontimeupdate={podcastPlayer.onTime}
	onloadedmetadata={podcastPlayer.onMeta}
	onended={podcastPlayer.onEnded}
></audio>

{#if podcastPlayer.src}
	<div class="spacer" aria-hidden="true"></div>
	<div class="bar">
		<button
			type="button"
			class="play"
			onclick={podcastPlayer.toggle}
			aria-label={podcastPlayer.playing ? 'Pause' : 'Play'}
		>
			{#if podcastPlayer.playing}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<rect x="6" y="5" width="4" height="14" rx="1" />
					<rect x="14" y="5" width="4" height="14" rx="1" />
				</svg>
			{:else}
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
					style="margin-left:2px"
				>
					<path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.28-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
				</svg>
			{/if}
		</button>
		<div class="body">
			<div class="row1">
				{#if podcastPlayer.href}
					<a href={podcastPlayer.href} class="title">{podcastPlayer.title}</a>
				{:else}
					<span class="title">{podcastPlayer.title}</span>
				{/if}
				<span class="time"
					>{formatPlaybackTime(podcastPlayer.current)} / {formatPlaybackTime(
						podcastPlayer.duration
					)}</span
				>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div
				class="track"
				onclick={podcastPlayer.seek}
				role="slider"
				aria-label="Seek"
				aria-valuenow={podcastPlayer.progress}
				tabindex="-1"
			>
				<div class="fill" style:width="{podcastPlayer.progress}%"></div>
			</div>
		</div>
		{#if canClose}
			<button type="button" class="close" onclick={podcastPlayer.stop} aria-label="Stop">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
				</svg>
			</button>
		{/if}
	</div>
{/if}

<style>
	.spacer {
		height: 84px;
	}
	.bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 40;
		/* pull the bar out of the crossfading root page snapshot during view
		   transitions — otherwise the incoming page's pixels briefly show through
		   it as old/new root snapshots fade into each other */
		view-transition-name: now-playing-bar;
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 20px;
		background: var(--bg);
		border-top: 1px solid var(--hair);
		box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.06);
	}
	.play {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: var(--radius-round);
		border: none;
		cursor: pointer;
		background: var(--red);
		color: #fff;
		transition:
			opacity 0.2s,
			transform 0.25s var(--ease-pop);
	}
	.play:hover {
		opacity: 0.88;
	}
	.play:active {
		transform: scale(0.94);
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	.row1 {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}
	.title {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 13.5px;
		font-weight: 500;
		color: var(--ink);
		text-decoration: none;
	}
	a.title:hover {
		color: var(--red);
	}
	.time {
		flex: none;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--faint);
	}
	.track {
		margin-top: 8px;
		height: 4px;
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
		background: linear-gradient(to right, var(--yellow), var(--red));
	}
	.close {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: var(--radius-round);
		border: none;
		background: none;
		cursor: pointer;
		color: var(--faint);
		transition:
			color 0.2s,
			background 0.2s;
	}
	.close:hover {
		color: var(--ink);
		background: var(--wash);
	}
	@media (max-width: 480px) {
		.time {
			display: none;
		}
	}
</style>
