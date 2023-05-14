<script>
	import { page } from '$app/stores';
	import '../tailwind.css';
	import Nav from '../components/Nav.svelte';
	import { MY_TWITTER_HANDLE, MY_YOUTUBE, REPO_URL, SITE_TITLE } from '$lib/siteConfig';
</script>

<svelte:head>
	<link
		rel="alternate"
		type="application/rss+xml"
		title={'RSS Feed for ' + SITE_TITLE}
		href="/rss.xml"
	/>
</svelte:head>

<div class="flex flex-col justify-center bg-yellow-400 px-4 dark:bg-gray-900 sm:px-8">
	<Nav />
</div>
<main class="flex flex-col justify-center bg-yellow-400 px-4 dark:bg-gray-900 sm:px-8">
	<slot />
</main>

{#if $page.url?.pathname !== '/'}
	<footer class="mx-auto mb-8 flex w-full max-w-2xl flex-col items-start justify-center">
		<hr class="border-1 mb-8 w-full border-gray-900 dark:border-yellow-400" />
		<div class="grid w-full max-w-2xl grid-cols-1 gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-8">
			<div class="flex flex-col space-y-4">
				<a
					class="text-gray-900 transition hover:text-logo-red dark:text-yellow-400 dark:hover:text-logo-red"
					href="/">Home</a
				>
				<a
					class="text-gray-900 transition hover:text-logo-red dark:text-yellow-400 dark:hover:text-logo-red"
					href="/about">About</a
				>
				<a
					class="text-gray-900 transition hover:text-logo-red dark:text-yellow-400 dark:hover:text-logo-red"
					href="/rss.xml"
					rel="external"
				>
					RSS
				</a>
			</div>
			<div class="flex flex-col space-y-4">
				<a
					class="text-gray-900 transition hover:text-logo-red dark:text-yellow-400 dark:hover:text-logo-red"
					target="_blank"
					rel="noopener noreferrer"
					href={'https://twitter.com/intent/follow?screen_name=' + MY_TWITTER_HANDLE}
				>
					Twitter
				</a>
				<a
					class="text-gray-900 transition hover:text-logo-red dark:text-yellow-400 dark:hover:text-logo-red"
					target="_blank"
					rel="noopener noreferrer"
					href={REPO_URL.split('/').slice(0, -1).join('/')}
				>
					GitHub
				</a>
			</div>
		</div>
		<p class="px-4 text-gray-900 dark:text-gray-400 sm:px-8">
			Built with the
			<a href="https://swyxkit.netlify.app/">swyxkit</a>
			template.
		</p>
	</footer>
{/if}
