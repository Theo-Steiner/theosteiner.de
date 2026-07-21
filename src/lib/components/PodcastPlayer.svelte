<script lang="ts">
	import { PodcastPlayerState, formatPlaybackTime } from '$lib/podcast-player.svelte';

	let { src }: { src: string } = $props();

	const player = new PodcastPlayerState(src);
</script>

<div class="player">
	<button type="button" class="play" onclick={player.toggle} aria-label={player.playing ? 'Pause' : 'Play'}>
		{#if player.playing}
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<rect x="6" y="5" width="4" height="14" rx="1" />
				<rect x="14" y="5" width="4" height="14" rx="1" />
			</svg>
		{:else}
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="currentColor"
				aria-hidden="true"
				style="margin-left:2px"
			>
				<path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.28-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
			</svg>
		{/if}
	</button>
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
	<audio
		bind:this={player.audio}
		{src}
		preload="none"
		ontimeupdate={player.onTime}
		onloadedmetadata={player.onMeta}
		onended={player.onEnded}
	></audio>
</div>

<style>
	.player {
		display: flex;
		align-items: center;
		gap: 18px;
	}
	.play {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
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
	.scrubber {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}
	.time {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--faint);
		min-width: 2.6em;
	}
	.time.right {
		text-align: right;
	}
	.track {
		flex: 1;
		height: 6px;
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
</style>
