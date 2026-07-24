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
</style>
