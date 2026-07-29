<script lang="ts">
	import { podcastPlayer, parseVTT, formatPlaybackTime, type SubtitleCue } from '$lib/podcast-player.svelte';
	import { theme } from '$lib/theme.svelte';

	let {
		src,
		title,
		transcripts
	}: {
		src: string;
		title: string;
		transcripts: { label: string; src: string }[];
	} = $props();

	let selectedTranscript = $state(0);
	let loading = $state(false);

	// speaker hues step along the site's own yellow -> red gradient, assigned in
	// order of first appearance. Pure --yellow reads fine on a dark background but
	// fails contrast as small text on the light cream bg, so the light-mode stops
	// are pulled down to a gold/amber -> red range instead of the literal brand hex.
	const PALETTE_LIGHT = ['#a16207', '#c2410c', '#dc2626', '#e1000d'];
	const PALETTE_DARK = ['#facc15', '#fb923c', '#f87171', '#e1000d'];

	let cues: SubtitleCue[] = $state([]);
	let container: HTMLDivElement | undefined = $state();

	$effect(() => {
		const forSrc = transcripts[selectedTranscript]?.src;
		if (!forSrc) return;
		loading = true;
		(async () => {
			try {
				const res = await fetch(forSrc);
				if (!res.ok) return;
				const text = await res.text();
				if (transcripts[selectedTranscript]?.src !== forSrc) return;
				cues = parseVTT(text);
			} catch {
				// no transcript available — the section just won't show
			} finally {
				if (transcripts[selectedTranscript]?.src === forSrc) loading = false;
			}
		})();
	});

	const speakerColors = $derived.by(() => {
		const palette = theme.dark ? PALETTE_DARK : PALETTE_LIGHT;
		const map = new Map<string, string>();
		for (const cue of cues) {
			if (cue.speaker && !map.has(cue.speaker)) {
				map.set(cue.speaker, palette[map.size % palette.length]);
			}
		}
		return map;
	});

	const isActive = $derived(podcastPlayer.src === src);
	// speaker turns in these transcripts overlap slightly at their edges, so pick
	// the most recently started cue rather than the first range match — otherwise
	// an earlier, still-technically-in-range cue can outrank the one that's actually current
	const activeIndex = $derived(
		isActive
			? cues.reduce((acc, cue, i) => (cue.start <= podcastPlayer.current ? i : acc), -1)
			: -1
	);

	// smooth-scroll the active line into view within our own panel, without
	// yanking the rest of the page around
	$effect(() => {
		if (activeIndex < 0 || !container) return;
		const el = container.querySelector<HTMLElement>(`[data-cue-index="${activeIndex}"]`);
		el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	});

	function onCueClick(cue: SubtitleCue) {
		podcastPlayer.open({ src, title, at: cue.start });
	}
</script>

{#if transcripts.length}
	<div class="kicker">
		<div>
			<h2>Transcript</h2>
			<span class="kicker-ja">文字起こし</span>
		</div>
		{#if transcripts.length > 1}
			<div class="languages" aria-label="Transcript language">
				{#each transcripts as transcript, i (transcript.src)}
					<button
						type="button"
						class:active={i === selectedTranscript}
						aria-pressed={i === selectedTranscript}
						onclick={() => (selectedTranscript = i)}
					>
						{transcript.label}
					</button>
					{/each}
				</div>
		{/if}
	</div>
	<div class:loading class="transcript" bind:this={container} aria-busy={loading}>
		{#each cues as cue, i (i)}
			<button
				type="button"
				class="cue"
				class:active={i === activeIndex}
				data-cue-index={i}
				onclick={() => onCueClick(cue)}
			>
				<span class="meta">
					<span class="time">{formatPlaybackTime(cue.start)}</span>
					{#if cue.speaker}
						<span class="speaker" style:color={speakerColors.get(cue.speaker)}
							>{cue.speaker}</span
						>
					{/if}
				</span>
				<span class="text">{cue.text}</span>
			</button>
		{/each}
	</div>
{/if}

<style>
	.kicker {
		margin-top: 40px;
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 16px;
	}
	.languages {
		display: flex;
		gap: 4px;
		padding: 3px;
		border: 1px solid var(--hair);
		border-radius: var(--radius-2);
	}
	.languages button {
		border: 0;
		border-radius: calc(var(--radius-2) - 2px);
		padding: 4px 8px;
		background: transparent;
		color: var(--faint);
		font-family: var(--font-mono);
		font-size: 11px;
		cursor: pointer;
	}
	.languages button:hover,
	.languages button.active {
		background: var(--wash);
		color: var(--ink);
	}
	.transcript {
		margin-top: 14px;
		max-height: 420px;
		overflow-y: auto;
		border: 1px solid var(--hair);
		border-radius: var(--radius-2);
		padding: 4px;
		transition: opacity 0.15s ease;
	}
	.transcript.loading {
		opacity: 0.72;
	}
	.cue {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		width: 100%;
		padding: 10px 12px;
		border: none;
		background: none;
		border-radius: var(--radius-2);
		text-align: left;
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 14px;
		line-height: 1.6;
		color: var(--muted);
		transition:
			background 0.2s,
			color 0.2s;
	}
	.cue:hover {
		background: var(--wash);
		color: var(--ink);
	}
	.cue.active {
		background: var(--wash);
		color: var(--ink);
		font-weight: 500;
	}
	.meta {
		flex: none;
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 5.2em;
		padding-top: 0.1em;
	}
	.time {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--faint);
	}
	.cue.active .time {
		color: var(--red);
	}
	.speaker {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
	}
</style>
