<script lang="ts">
	import type { Picture } from '@sveltejs/enhanced-img';

	type Orientation = 'landscape' | 'portrait';

	type Props = {
		src: Picture;
		alt: string;
		orientation?: Orientation;
		caption?: string;
		priority?: boolean;
	};

	let {
		src,
		alt,
		orientation = 'landscape',
		caption,
		priority = false
	}: Props = $props();

	const sizes = $derived(
		orientation === 'portrait'
			? 'min(460px, calc(100vw - 48px))'
			: 'min(632px, calc(100vw - 48px))'
	);
</script>

<figure class={['post-image', orientation]}>
	<enhanced:img
		{src}
		{alt}
		{sizes}
		loading={priority ? 'eager' : 'lazy'}
		fetchpriority={priority ? 'high' : undefined}
		decoding="async"
	/>
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	.post-image {
		width: 100%;
		margin: 28px auto;
	}

	.landscape {
		max-width: 632px;
	}

	.portrait {
		max-width: 460px;
	}

	.post-image :global(picture),
	.post-image :global(img) {
		display: block;
		width: 100%;
	}

	.post-image :global(img) {
		height: auto;
		border-radius: var(--radius-2);
	}

	figcaption {
		margin-top: 8px;
		font-family: var(--font-mono);
		font-size: 11px;
		line-height: 1.6;
		color: var(--faint);
	}
</style>
