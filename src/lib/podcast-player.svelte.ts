export function formatPlaybackTime(t: number) {
	if (!t || !isFinite(t)) return '0:00';
	const m = Math.floor(t / 60);
	const s = Math.floor(t % 60);
	return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export interface SubtitleCue {
	start: number;
	end: number;
	speaker?: string;
	text: string;
}

function parseVttTimestamp(ts: string): number {
	const parts = ts.trim().split(':').map(Number);
	if (parts.length === 3) {
		const [h, m, s] = parts;
		return h * 3600 + m * 60 + s;
	}
	const [m, s] = parts;
	return m * 60 + s;
}

/** minimal WebVTT parser — cue settings and inline markup are stripped, not honored */
export function parseVTT(vtt: string): SubtitleCue[] {
	const cues: SubtitleCue[] = [];
	const blocks = vtt.replace(/\r/g, '').split(/\n\n+/);
	for (const block of blocks) {
		const lines = block.split('\n').filter(Boolean);
		const timeLineIndex = lines.findIndex((line) => line.includes('-->'));
		if (timeLineIndex === -1) continue;
		const [startRaw, endRaw] = lines[timeLineIndex].split('-->');
		const start = parseVttTimestamp(startRaw);
		const end = parseVttTimestamp(endRaw.trim().split(' ')[0]);
		// UIT's transcripts prefix each cue with a "NOTE Speaker: <name>" line
		const bodyLines = lines.slice(timeLineIndex + 1);
		const speakerMatch = bodyLines[0]?.match(/^NOTE Speaker:\s*(.+)$/);
		const text = bodyLines
			.slice(speakerMatch ? 1 : 0)
			.join(' ')
			.replace(/<[^>]+>/g, '')
			.trim();
		if (!text) continue;
		cues.push({ start, end, speaker: speakerMatch?.[1], text });
	}
	return cues;
}

interface Episode {
	src: string;
	title: string;
	href?: string;
	/** jump to this time (seconds) once loaded — used by transcript-line clicks */
	at?: number;
}

/**
 * Single shared player, mounted once (see NowPlayingBar.svelte in the root layout) so
 * playback survives client-side navigation instead of dying with the page that started it.
 * Only the episode detail page triggers playback; it reads/drives this instead of owning
 * its own <audio>.
 */
export class PodcastPlayerState {
	#audioEl: HTMLAudioElement | undefined = $state();
	playing = $state(false);
	current = $state(0);
	duration = $state(0);
	src = $state('');
	title = $state('');
	href = $state('');

	/** set by open() when switching episodes with `at`; applied once metadata is ready */
	private pendingSeek: number | undefined;

	get audio() {
		return this.#audioEl;
	}

	/**
	 * bound via `bind:this` on the single <audio> in NowPlayingBar (root layout).
	 * A page can call open() before that binding exists yet — e.g. a detail
	 * page's own mount effect can run ahead of the layout's — so open() may set
	 * `src` with no element to apply it to. Re-sync here the moment the element
	 * does show up, instead of silently losing that state.
	 */
	set audio(el: HTMLAudioElement | undefined) {
		this.#audioEl = el;
		if (!el || !this.src) return;
		el.src = this.src;
		el.load();
		if (this.playing) el.play().catch(() => {});
	}

	get storageKey() {
		return this.src ? `theo-podcast-pos:${this.src}` : '';
	}

	get progress() {
		return this.duration ? (this.current / this.duration) * 100 : 0;
	}

	/**
	 * Load an episode, or act on the one already loaded:
	 * - same src + `at` given → seek there and make sure it's playing
	 * - same src, no `at` → toggle play/pause
	 * - different src → switch to it; pass `autoplay: false` to load without
	 *   starting playback (used to silently preload the episode a detail page
	 *   is about to show, only when nothing else is already playing)
	 */
	open = (episode: Episode, options?: { autoplay?: boolean }) => {
		if (!episode.src) return;
		if (this.src === episode.src) {
			if (episode.at !== undefined) {
				this.seekTo(episode.at);
				if (!this.playing) this.toggle();
			} else {
				this.toggle();
			}
			return;
		}

		this.pendingSeek = episode.at;
		this.src = episode.src;
		this.title = episode.title;
		this.href = episode.href ?? '';
		this.current = 0;
		this.duration = 0;
		this.playing = false;

		const audio = this.audio;
		if (!audio) return;
		audio.src = episode.src;
		audio.load();
		if (options?.autoplay ?? true) {
			audio.play().then(
				() => {
					this.playing = true;
				},
				() => {}
			);
		}
	};

	toggle = () => {
		const audio = this.audio;
		if (!audio || !this.src) return;
		if (audio.paused) {
			audio.play();
			this.playing = true;
		} else {
			audio.pause();
			this.playing = false;
		}
	};

	stop = () => {
		const audio = this.audio;
		if (audio) {
			audio.pause();
			audio.removeAttribute('src');
			audio.load();
		}
		this.playing = false;
		this.src = '';
		this.title = '';
		this.href = '';
		this.current = 0;
		this.duration = 0;
	};

	seekTo = (time: number) => {
		const audio = this.audio;
		if (!audio) return;
		audio.currentTime = time;
		this.current = time;
	};

	seek = (event: MouseEvent) => {
		if (!this.duration) return;
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
		this.seekTo(ratio * this.duration);
	};

	onTime = () => {
		const audio = this.audio;
		if (!audio) return;
		this.current = audio.currentTime;
		try {
			if (this.storageKey) localStorage.setItem(this.storageKey, String(this.current));
		} catch {}
	};

	onMeta = () => {
		const audio = this.audio;
		if (!audio) return;
		this.duration = audio.duration;

		if (this.pendingSeek !== undefined) {
			audio.currentTime = this.pendingSeek;
			this.current = this.pendingSeek;
			this.pendingSeek = undefined;
			return;
		}

		let saved = 0;
		try {
			saved = (this.storageKey && parseFloat(localStorage.getItem(this.storageKey) ?? '')) || 0;
		} catch {}
		// resume where the listener left off, unless they basically finished
		if (saved > 1 && saved < this.duration - 2) {
			audio.currentTime = saved;
			this.current = saved;
		}
	};

	onEnded = () => {
		try {
			if (this.storageKey) localStorage.removeItem(this.storageKey);
		} catch {}
		this.playing = false;
		this.current = 0;
	};
}

export const podcastPlayer = new PodcastPlayerState();
