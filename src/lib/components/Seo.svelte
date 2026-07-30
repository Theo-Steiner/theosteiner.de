<script lang="ts">
	import {
		DEFAULT_OG_IMAGE,
		SITE_TITLE,
		SITE_URL
	} from '$lib/siteConfig';
	import { STANDARD_SITE_PUBLICATION_URI } from '$lib/standardSite';

	let {
		title,
		description,
		path,
		image = DEFAULT_OG_IMAGE,
		type = 'website',
		standardSiteDocumentUri,
		noindex = false
	}: {
		title: string;
		description?: string;
		path: string;
		image?: string;
		type?: string;
		standardSiteDocumentUri?: string;
		noindex?: boolean;
	} = $props();

	const canonical = $derived(path.startsWith('http') ? path : `${SITE_URL}${path === '/' ? '' : path}`);
	const documentTitle = $derived(title === SITE_TITLE ? title : `${title} — ${SITE_TITLE}`);
</script>

<svelte:head>
	<title>{documentTitle}</title>
	{#if noindex}
		<meta name="robots" content="noindex, nofollow, noarchive" />
	{/if}
	{#if description}
		<meta name="description" content={description} />
		<meta property="og:description" content={description} />
		<meta name="twitter:description" content={description} />
	{/if}
	<link rel="canonical" href={canonical} />
	{#if STANDARD_SITE_PUBLICATION_URI}
		<link rel="site.standard.publication" href={STANDARD_SITE_PUBLICATION_URI} />
	{/if}
	{#if standardSiteDocumentUri}
		<link rel="site.standard.document" href={standardSiteDocumentUri} />
	{/if}
	<meta property="og:site_name" content={SITE_TITLE} />
	<meta property="og:title" content={title} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={`${title} — ${SITE_TITLE}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={`${title} — ${SITE_TITLE}`} />
</svelte:head>
