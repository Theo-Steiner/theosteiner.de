import { browser } from '$app/environment';

/** mirrors the `dark` class set on <html> by the inline script in app.html */
export const theme = $state({
	dark: browser ? document.documentElement.classList.contains('dark') : false
});

export function toggleTheme() {
	theme.dark = !theme.dark;
	document.documentElement.classList.toggle('dark', theme.dark);
	try {
		localStorage.setItem('theo-theme', theme.dark ? 'dark' : 'light');
	} catch {
		// private mode etc. — theme just won't persist
	}
}
