<script lang="ts">
	let { height, title = 'theosteiner' }: { height?: number; title?: string } = $props();

	// Default sizing is derived from font metrics:
	// Instrument Sans x-height (510) / Geist Mono x-height (534), then mapped
	// onto this outline's 881-unit visual box and 125-unit depth below baseline.
	const explicitWidth = $derived(height ? (7470 / 881) * height : undefined);
	const explicitBaseline = $derived(height ? -(125 / 881) * height : undefined);
</script>

<!-- Geist Mono 600 converted to outlines. This avoids font-loading swaps while
	 preserving one exact baseline across the braces and every letter. -->
<svg
	role="img"
	aria-label={title}
	viewBox="0 -756 7470 881"
	height={height ?? undefined}
	width={explicitWidth}
	style:vertical-align={explicitBaseline === undefined ? undefined : `${explicitBaseline}px`}
	shape-rendering="geometricPrecision"
>
	<defs>
		<path id="brace-open" d="M404-125Q309-125 267-73.5T225 58v96q0 63-19.5 85T106 261v109q80 0 99.5 22t19.5 85v95q0 81 42 132.5T404 756h90V649h-74q-79 0-79-87v-82q0-71-34-113t-103-48v-7q69-6 103-47.5T341 150V69q0-87 79-87h74v-107Z" />
		<path id="t" d="M375 0q-86 0-127-39.5T207-160v-278H46v-96h161v-125h118v125h203v96H325v269q0 73 71 73h132V0Z" />
		<path id="h" d="M86 0v-710h118v254q49-90 155-90 81 0 124 54t43 148V0H408v-317q0-68-23-98t-67-30q-114 0-114 134V0Z" />
		<path id="e" d="M304 12q-113 0-182-73.5T53-267q0-126 68-202.5T301-546q111 0 178.5 76.5T547-265v31H175q5 68 39.5 104T306-94q84 0 110-74l121 9q-25 80-85 125.5T304 12ZM177-320h242q-5-61-37-90.5T300-440q-105 0-123 120Z" />
		<path id="s" d="M307 12q-109 0-171-49.5T70-168l118-5q8 38 37 60.5T308-90q101 0 101-54 0-27-41.5-37.5T293-212q-118-23-164.5-61T82-380q0-75 55.5-120.5T295-546q110 0 165.5 50t63.5 126l-119 6q-11-80-109-80-93 0-93 64 0 32 32.5 46t92.5 29q116 22 159 54.5T530-145q0 73-60 115T307 12Z" />
		<path id="i" d="M72 0v-96h204v-342H82v-96h312v438h174V0Zm199-605v-112h120v112Z" />
		<path id="n" d="M76 0v-534h108l3 96q44-108 164-108 89 0 131 55t42 146V0H406v-317q0-128-95-128-117 0-117 132V0Z" />
		<path id="r" d="M78 0v-96h132v-342H78v-96h222l7 105q25-105 128-105h117v99H442q-114 0-114 123v216h165V0Z" />
		<path id="brace-close" d="M196-125h-90V-18h74q79 0 79 87v81q0 73 34.5 114.5T396 312v7q-68 6-102.5 48T259 480v82q0 87-79 87h-74v107h90q95 0 137-51.5T375 572v-95q0-63 20-85t99-22V261q-79 0-99-22t-20-85V58q0-80-42-131.5T196-125Z" />
	</defs>
	<g fill="currentColor" stroke="currentColor" stroke-width="22" stroke-linejoin="round" paint-order="stroke fill">
		<use href="#brace-open" transform="scale(1 -1)" />
		<use href="#t" x="480" />
		<use href="#h" x="1080" />
		<use href="#e" x="1680" />
		<!-- Hinomaru: a true circle, optically centered in the mono character cell. -->
		<circle cx="2580" cy="-267" r="279" fill="var(--red)" stroke="none" />
		<use href="#s" x="2870" />
		<use href="#t" x="3470" />
		<use href="#e" x="4070" />
		<use href="#i" x="4670" />
		<use href="#n" x="5270" />
		<use href="#e" x="5870" />
		<use href="#r" x="6470" />
		<use href="#brace-close" transform="translate(6935 0) scale(1 -1)" />
	</g>
</svg>

<style>
	svg {
		display: inline-block;
		width: 7.1343em;
		height: 0.8414em;
		vertical-align: -0.1194em;
		overflow: visible;
	}
	svg[height] {
		width: auto;
	}
</style>
