export function formatPlaybackTime(t: number) {
	if (!t || !isFinite(t)) return '0:00';
	const m = Math.floor(t / 60);
	const s = Math.floor(t % 60);
	return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/** shared play/seek/resume logic behind PodcastRow (compact) and PodcastPlayer (detail page) */
export class PodcastPlayerState {
	audio: HTMLAudioElement | undefined = $state();
	playing = $state(false);
	started = $state(false);
	current = $state(0);
	duration = $state(0);

	src: string;

	constructor(src: string) {
		this.src = src;
	}

	get storageKey() {
		return `theo-podcast-pos:${this.src}`;
	}

	get progress() {
		return this.duration ? (this.current / this.duration) * 100 : 0;
	}

	toggle = () => {
		const audio = this.audio;
		if (!audio) return;
		if (audio.paused) {
			audio.play();
			this.playing = true;
			this.started = true;
		} else {
			audio.pause();
			this.playing = false;
		}
	};

	seek = (event: MouseEvent) => {
		const audio = this.audio;
		if (!audio || !this.duration) return;
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
		audio.currentTime = ratio * this.duration;
		this.current = audio.currentTime;
	};

	onTime = () => {
		const audio = this.audio;
		if (!audio) return;
		this.current = audio.currentTime;
		try {
			localStorage.setItem(this.storageKey, String(this.current));
		} catch {}
	};

	onMeta = () => {
		const audio = this.audio;
		if (!audio) return;
		this.duration = audio.duration;
		let saved = 0;
		try {
			saved = parseFloat(localStorage.getItem(this.storageKey) ?? '') || 0;
		} catch {}
		// resume where the listener left off, unless they basically finished
		if (saved > 1 && saved < this.duration - 2) {
			audio.currentTime = saved;
			this.current = saved;
			this.started = true;
		}
	};

	onEnded = () => {
		try {
			localStorage.removeItem(this.storageKey);
		} catch {}
		this.playing = false;
		this.current = 0;
	};
}
