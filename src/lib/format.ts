const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Oct 14" (home) or "Oct 14 ’23" (contents) */
export function shortDate(iso: string, withYear = false) {
	const date = new Date(iso);
	const base = `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;
	return withYear ? `${base} ’${String(date.getUTCFullYear()).slice(2)}` : base;
}

/** "Oct 14, 2023" for article headers and feeds */
export function longDate(iso: string) {
	const date = new Date(iso);
	return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}
