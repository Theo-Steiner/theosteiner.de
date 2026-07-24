// Registers the atproto-comments SSR renderer with ElementRendererRegistry so
// the server can render <atproto-comments> into declarative shadow DOM. The
// module self-registers on import (and installs the DOM shim first), so this
// side-effect import is all that's needed.
import '@svebcomponents/atproto.comments/ssr';
