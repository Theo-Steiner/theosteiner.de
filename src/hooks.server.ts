// Loads the package's Svelte-specific server entrypoint. It installs the DOM
// shim and self-registers the atproto-comments renderer, allowing the Vite
// wrapper to emit declarative shadow DOM during SSR.
import '@svebcomponents/atproto.comments/ssr';
