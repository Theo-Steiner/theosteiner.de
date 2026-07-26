<script lang="ts">
	import {
		DEFAULT_OG_IMAGE,
		SITE_TITLE,
		SITE_URL
	} from '$lib/siteConfig';

	let {
		title,
		description,
		path,
		image = DEFAULT_OG_IMAGE,
		type = 'website'
	}: {
		title: string;
		description?: string;
		path: string;
		image?: string;
		type?: string;
	} = $props();

	const canonical = $derived(path.startsWith('http') ? path : `${SITE_URL}${path === '/' ? '' : path}`);
	const documentTitle = $derived(title === SITE_TITLE ? title : `${title} — ${SITE_TITLE}`);
</script>

<svelte:head>
	<title>{documentTitle}</title>
	{#if description}
		<meta name="description" content={description} />
		<meta property="og:description" content={description} />
		<meta name="twitter:description" content={description} />
	{/if}
	<link rel="canonical" href={canonical} />
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
