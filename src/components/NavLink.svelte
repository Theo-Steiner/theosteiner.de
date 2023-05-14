<script lang="ts">
	import { page } from '$app/stores';
	export let href: string;
	$: isActive = $page.url.pathname === href;
</script>

<a
	class="hidden rounded-lg p-1 font-semibold text-gray-900 transition-all hover:bg-yellow-100/50 dark:text-yellow-400 sm:px-3 sm:py-2 md:inline-block"
	class:underline={isActive}
	{href}
	><span class="capsize"><slot /> </span>
</a>
