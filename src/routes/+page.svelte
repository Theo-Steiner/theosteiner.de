<script>
	import FeatureCard from '../components/FeatureCard.svelte';
	import {
		SITE_URL,
		SITE_TITLE,
		SITE_DESCRIPTION,
		DEFAULT_OG_IMAGE,
		MY_TWITTER_HANDLE
	} from '$lib/siteConfig';
	import Logo from '../components/Logo.svelte';
</script>

<svelte:head>
	<title>{SITE_TITLE}</title>
	<link rel="canonical" href={SITE_URL} />
	<link rel="alternate" type="application/rss+xml" href={SITE_URL + '/rss.xml'} />
	<meta property="og:url" content={SITE_URL} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={SITE_TITLE} />
	<meta name="Description" content={SITE_DESCRIPTION} />
	<meta property="og:description" content={SITE_DESCRIPTION} />
	<meta property="og:image" content={DEFAULT_OG_IMAGE} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content={'@' + MY_TWITTER_HANDLE} />
	<meta name="twitter:title" content={SITE_TITLE} />
	<meta name="twitter:description" content={SITE_DESCRIPTION} />
	<meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
</svelte:head>

<header
	class="m-6 flex flex-col items-center justify-center gap-2 text-xl font-bold text-gray-900 dark:text-yellow-400"
>
	<p>Hey, nice to meet you!</p>
	<p>My name is</p>
	<a href="/about"><Logo /></a>
	<p>and on here I write about</p>
</header>
<div class="mb-6 flex flex-col gap-6 md:flex-row">
	<FeatureCard category="japan" href="/blog?filter=japan" title="Japan" />
	<FeatureCard category="code" href="/blog?filter=code" title="Coding" />
	<FeatureCard category="misc" href="/blog?filter=misc" title="& other Stuff" />
</div>
