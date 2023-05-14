<script lang="ts">
	export let title = 'Untitled post';
	export let href = '#';
	export let category: 'code' | 'japan' | 'misc';
</script>

<a
	class="w-full transform transform-gpu rounded-xl bg-gray-900 p-1 font-bold transition-all hover:scale-105 dark:bg-yellow-400 md:w-1/3"
	{href}
	><div
		class="flex h-full flex-col justify-between rounded-lg bg-yellow-400 text-gray-900 dark:bg-gray-900 dark:text-yellow-400
    {category === 'japan' ? 'bg-clouds' : category === 'code' ? 'bg-circuit' : 'bg-topography'} 
    p-4"
	>
		<h4 class="w-full p-6 text-center text-2xl tracking-tight">
			{title}
		</h4>
	</div></a
>

<style>
	div {
		text-shadow: -1px -1px 0 #facc15, 1px -1px 0 #facc15, -1px 1px 0 #facc15, 1px 1px 0 #facc15;
	}

	:global(.dark) div {
		text-shadow: -1px -1px 0 #111827, 1px -1px 0 #111827, -1px 1px 0 #111827, 1px 1px 0 #111827;
	}
</style>
