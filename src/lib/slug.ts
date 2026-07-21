/** mirrors scripts/migrate-from-github.mjs's slugify, for talks/podcasts without an explicit slug */
export function slugify(text: string): string {
	return text
		.toString()
		.normalize('NFKD')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/(^-|-$)/g, '');
}
