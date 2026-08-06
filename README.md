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

Every top-level key of the `docs.json` standard is declared in the schema, in one of three tiers:

| Tier | Behavior |
| --- | --- |
| **Supported** | Implemented and strictly validated. |
| **Reserved** | Part of the standard, accepted and ignored, with a build notice. |
| **Unknown** | Rejected, with a "did you mean" suggestion. |

The reserved tier is the point: a `docs.json` written against the full standard builds here using the subset Shiso implements, instead of failing on the first feature that isn't written yet. Reserved keys are annotated `"x-shiso": "reserved"` in the schema, and [`SETTINGS.md`](./SETTINGS.md) documents the full standard.

Implemented today: `name`, `description`, `colors` (`primary`, `light`), `logo`, `favicon`, and `navigation` with `tabs`, `dropdowns`, `anchors`, `groups`, `pages`, page objects (`{ page, title, icon, tag, hidden }`), external links (`{ href, label }`), and arbitrarily nested groups (`{ group, pages, root, icon, hidden }`). `versions` and `languages` resolve to their default entry and report the ones they skipped.

Hidden pages are still built and reachable by URL, but are left out of the sidebar, the prev/next pager, and search, and are served `noindex`.

### Shiso-only options

Anything Shiso adds beyond the standard is namespaced under `$shiso`, so `docs.json` stays portable:

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
