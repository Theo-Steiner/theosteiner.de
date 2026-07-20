import type { Component } from 'svelte';
import type { PostMeta } from '$lib/types';

interface PostModule {
	default: Component;
	metadata: PostMeta;
}

/**
 * Lazy importers for the post components — universal (client + server) so
 * the article page can hydrate. Metadata/feed logic lives in $lib/server.
 */
const modules = import.meta.glob<PostModule>('/src/content/posts/*.md');

export function loadPost(slug: string) {
	const importer = modules[`/src/content/posts/${slug}.md`];
	return importer ? importer() : null;
}
