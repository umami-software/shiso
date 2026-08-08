# Shiso

Shiso is an open-source docs site generator built with [Vite](https://vite.dev), React, and MDX. All configuration lives in a single `docs.json` file.

Fork it, drop in your `docs.json` and markdown files, and build a fully static docs site.

## Quick start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:8001/docs`.

## How it works

- Site config and navigation live in `docs.json`
- Content lives in `content/docs/**/*.mdx` (or `.md`)
- `pnpm build` prerenders every page to static HTML in `dist/client` — deploy that folder anywhere (Netlify, Vercel, GitHub Pages, S3, nginx)

Every page in `docs.json` navigation must map to a real file in `content/docs`. Missing files fail the build.

## docs.json

The format is described by [`docs.schema.json`](./docs.schema.json) — add `"$schema": "./docs.schema.json"` to `docs.json` for editor autocomplete. The build validates the config against the schema (`pnpm check:config` runs it standalone).

Every top-level key recognized by Shiso is declared in the schema, in one of three tiers:

| Tier | Behavior |
| --- | --- |
| **Supported** | Implemented and strictly validated. |
| **Reserved** | Recognized but not implemented; accepted and ignored with a build notice. |
| **Unknown** | Rejected, with a "did you mean" suggestion. |

The reserved tier lets configs from other docs platforms build using the subset Shiso implements instead of failing on recognized features that are not implemented yet. Reserved keys are annotated `"x-shiso": "reserved"` in the schema, and [`SETTINGS.md`](./SETTINGS.md) documents the available settings.

Implemented today: `name`, `description`, `colors` (`primary`, `light`, `dark`), `logo`, `favicon`, `navbar` (links and primary button), `footer` (socials and link columns), `banner` (dismissible site-wide banner), `redirects` (exact-match static redirects), `seo` (`metatags`, `indexing`, plus a generated `sitemap.xml`), `errors.404` (custom title/description or redirect home), `metadata.timestamp` (last-modified dates from git), `appearance` (default mode and strict lock), `fonts` (Google Fonts or self-hosted, with heading/body overrides), `styling.eyebrows`, `background` (color and image per mode), `search.prompt` (built-in client-side search), `interaction.drilldown`, `contextual` (copy/view markdown, AI assistant links, custom entries — every page is also published as raw `.md`), and `navigation` with `tabs`, `dropdowns`, `anchors`, `groups`, `pages`, page objects (`{ page, title, icon, tag, hidden }`), external links (`{ href, label }`), and collapsible nested groups (`{ group, pages, root, icon, expanded, hidden }`). `versions` and `languages` resolve to their default entry and report the ones they skipped.

Hidden pages are still built and reachable by URL, but are left out of the sidebar, the prev/next pager, and search, and are served `noindex`.

### Shiso-only options

Shiso-specific options are namespaced under `$shiso`, so `docs.json` stays portable:

```json
{
  "$shiso": {
    "docsPrefix": "/docs",
    "contentDir": "content/docs",
    "siteUrl": "https://docs.example.com"
  }
}
```

- `docsPrefix` — where docs are mounted within the site. Use `""` to serve them at the root.
- `contentDir` — content directory, relative to the project root.
- `siteUrl` — absolute origin. Required for `canonical`, `og:url`, and structured data; those tags are omitted without it.

To deploy under a subpath, set Vite's `base` (`vite build --base=/my-docs/`). Routes, prerendered output paths, and the router `basename` all follow it.

## Components

Markdown content can use the built-in docs components without imports: `Accordion`, `AccordionGroup`, `Badge`, `Callout`, `Note`, `Tip`, `Warning`, `Info`, `Check`, `Danger`, `Card`, `CardGroup`, `CodeGroup`, `Columns`, `Column`, `Expandable`, `Frame`, `Icon`, `ParamField`, `Param`, `RequestExample`, `ResponseExample`, `ResponseField`, `Steps`, `Step`, `Tabs`, `Tab`, `Tooltip`.

`Icon`, `Card`, `Callout`, and `Accordion` accept [lucide](https://lucide.dev/icons) icon names (`icon="rocket"`). Names are collected from your content at build time into `src/lib/icon-registry.generated.ts` — regenerated automatically by the dev server and build, or manually with `pnpm icons:registry`.

## Common commands

```bash
pnpm dev      # dev server at http://localhost:8001
pnpm build    # static site to dist/client
pnpm preview  # preview the built site
pnpm test     # vitest
pnpm lint
```

## License

MIT
