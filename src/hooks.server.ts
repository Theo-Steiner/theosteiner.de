// Loads the package's generated SSR entrypoint. It installs the DOM shim,
// self-registers the atproto-comments renderer and enables Svelte's async
// server runtime, allowing the Vite wrapper to emit declarative shadow DOM
// during SSR.
import '@svebcomponents/atproto.comments/ssr';
