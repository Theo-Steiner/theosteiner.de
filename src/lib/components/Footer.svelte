<script lang="ts">
	import { theme, toggleTheme } from '$lib/theme.svelte';
</script>

<footer>
	<a class="link-mono" href="/rss.xml" data-sveltekit-reload>:get rss</a>
	<button type="button" onclick={toggleTheme}>
		{theme.dark ? ':set bg=light' : ':set bg=dark'}
	</button>
</footer>

<style>
	footer {
		margin-top: 88px;
		padding-top: 20px;
		border-top: 1px solid var(--hair);
		display: flex;
		justify-content: flex-end;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 18px;
	}
	button {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--faint);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: color 0.2s;
	}
	button:hover {
		color: var(--red);
	}
</style>
