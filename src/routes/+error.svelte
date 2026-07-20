<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="error">
	<h1>{page.status}</h1>
	<p>
		{page.status === 404 ? 'This page seems to have :wq’d itself.' : (page.error?.message ?? 'Something went wrong.')}
	</p>
	<a href="/" class="link-marker">Back home &rarr;</a>
</div>

<style>
	.error {
		margin-top: 120px;
	}
	h1 {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 64px;
		font-weight: 500;
		color: var(--ink);
	}
	p {
		margin: 12px 0 28px;
		font-size: 17px;
		line-height: 1.7;
		color: var(--muted);
	}
	a {
		font-size: 14px;
	}
</style>
