<script lang="ts">
	// The @svebcomponents/ssr Vite plugin rewrites <atproto-comments> to its SSR
	// wrapper during server rendering (declarative shadow DOM) and uses the
	// client build in the browser, so a top-level import is SSR-safe. The
	// component self-fetches the thread during SSR and serializes it for
	// hydration. After hydration, the default hosted service keeps that snapshot
	// current through SSE and also handles sign-in and posting.
	import '@svebcomponents/atproto.comments';

	let { thread }: { thread: string } = $props();
</script>

<section class="bsky">
	<div class="kicker">
		<h2>Bluesky replies</h2>
		<span class="kicker-ja">返信</span>
	</div>
	<atproto-comments {thread}></atproto-comments>
</section>

<style>
	.bsky {
		margin-top: 64px;
	}

	/* atproto-comments is a web component: theme it through its documented
	   custom properties and ::part() hooks rather than fighting its shadow DOM.
	   :global() is required — Svelte doesn't scope-class custom elements, so
	   an unwrapped selector is treated as dead code and dropped. */
	:global(atproto-comments) {
		--atproto-comments-accent: var(--red);
		--atproto-comments-on-accent: #fff;
		--atproto-comments-bg: var(--bg);
		--atproto-comments-fg: var(--ink);
		--atproto-comments-border: var(--hair);
		--atproto-comments-muted: var(--faint);
		--atproto-comments-error: var(--red);
		--atproto-comments-radius: var(--radius-2);
	}

	/* mono for identity/meta, matching the mono treatment on the legacy
	   GitHub-era comments and the rest of the site's small UI text */
	:global(atproto-comments)::part(author),
	:global(atproto-comments)::part(handle),
	:global(atproto-comments)::part(timestamp),
	:global(atproto-comments)::part(reply-button) {
		font-family: var(--font-mono);
	}

	:global(atproto-comments)::part(reply-button) {
		font-size: 12px;
	}
</style>
