# theosteiner.de

Theo's personal site & blog — the "Highlighter" redesign, rebuilt on SvelteKit.

## Stack

- **SvelteKit 2** with the new toys: [remote functions](https://svelte.dev/docs/kit/remote-functions) (`$lib/data.remote.ts`, prerendered) and Svelte's experimental **async components** (`await` directly in components)
- **mdsvex + shiki** (`vesper` theme) for markdown posts with highlighted code
- **open-props** scales + hand-rolled design tokens (`src/app.css`) implementing the Highlighter design: cream/near-black pages, yellow marker accents, Instrument Sans / Instrument Serif / Noto Sans JP / Geist Mono (self-hosted via fontsource)
- **adapter-netlify**, fully prerendered — no runtime backend at all

## Content model

Everything on the site is a feed item: `blog`, `talk`, `podcast`, or `bluesky`.

| Type | Source | How to add |
| --- | --- | --- |
| blog | `src/content/posts/*.md` | drop a markdown file with frontmatter (`title`, `date`, `description`, `tags`) — the filename is the slug/URL |
| talk | `src/content/talks.ts` | append a typed entry |
| podcast | `src/content/podcasts.ts` | append a typed entry; `audioSrc` enables the inline player |
| bluesky | `src/content/statuses.ts` | append a typed entry (until the atproto backend fetches these) |

Home shows the latest six items ("Lately"); `/contents` shows everything with type filters; post URLs stay at `/<slug>` (unchanged from the swyxkit era).

### The GitHub archive

The old site used GitHub issues as CMS + comment system (swyxkit). That era is
frozen into the repo by `pnpm migrate` (`scripts/migrate-from-github.mjs`):

- posts → `src/content/posts/*.md` (reaction counts + issue link in frontmatter)
- comments → `src/content/comments/<slug>.json`, rendered read-only under each post
- commenter avatars → `static/avatars/`

Re-run it to pull comments that arrived on the original GitHub issues since the
last snapshot.

## Commands

```bash
pnpm dev      # dev server
pnpm build    # prerender everything (netlify deploys this)
pnpm preview  # serve the build
pnpm check    # svelte-check
pnpm migrate  # re-snapshot posts/comments from the archived GitHub issues
```

## Standard.site / Bluesky enhanced cards

Bluesky's enhanced article cards require verified Standard.site records; Open
Graph metadata alone only produces the normal link card. The one-time setup is:

1. Create a Bluesky app password, then add `ATPROTO_HANDLE=theosteiner.de` and
   `ATPROTO_APP_PASSWORD=…` to `.env`.
2. Run `pnpm standard-site:create-publication`. It creates the publication
   record once (or safely reuses the existing one), writes its AT-URI to
   `src/lib/standardSite.ts`, and creates the static
   `/.well-known/site.standard.publication` verification response.
3. Run `pnpm standard-site:publish all` to publish every blog post plus local
   talk and podcast detail page, or `pnpm standard-site:publish <slug>` for
   one blog post. This publishes (or updates) document records and saves their
   URIs in post frontmatter or `standard-site-documents.json`.

The page template emits the required `site.standard.publication` and
`site.standard.document` link relations for published posts.

### Publishing flow

The publication setup above is a one-time action. For each new or materially
updated article, talk, or podcast detail page:

1. Add or edit the content locally.
2. Run `pnpm standard-site:publish all` to create or update its Standard.site
   document record and save the resulting AT-URI in the repository.
3. Commit and push those changes; CI deploys the page with its verification
   link tag.
4. Once the deployment is live, create the Bluesky post linking to the public
   page. Creating it after deployment lets Bluesky discover the verified
   Standard.site document and render its enhanced card.
5. Save that post's URL as `bskyThread` on the local content item, run
   `pnpm standard-site:publish all` again, then commit, push, and deploy.

The second publish resolves `bskyThread` to Standard.site's strong
`bskyPostRef` (`at://` URI plus CID). That associates the document with its
Bluesky discussion and powers the on-page comments component. It does not
retroactively change the link card stored on an existing Bluesky post, which
is why the first deployment must happen before creating the Bluesky post.
