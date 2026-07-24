<script lang="ts">
	import { podcastPlayer } from '$lib/podcast-player.svelte';

	let { src, title }: { src: string; title: string } = $props();

	const isPlaying = $derived(podcastPlayer.src === src && podcastPlayer.playing);

	function onToggle() {
		podcastPlayer.open({ src, title });
	}
</script>

<button type="button" class="play-pill" onclick={onToggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
	{#if isPlaying}
		<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<rect x="6" y="5" width="4" height="14" rx="1" />
			<rect x="14" y="5" width="4" height="14" rx="1" />
		</svg>
		Pause
	{:else}
		<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M6 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 6 4.5z" />
		</svg>
		Play
	{/if}
</button>

<style>
	.play-pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 500;
		color: #fff;
		background: var(--red);
		border: none;
		border-radius: var(--radius-round);
		padding: 11px 20px;
		cursor: pointer;
		transition: transform 0.25s var(--ease-pop);
		min-width: 102px;
	}
	.play-pill:hover {
		transform: scale(1.05) rotate(-1deg);
	}
	.play-pill:active {
		transform: scale(0.96);
	}
</style>
