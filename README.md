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

Supported: `name`, `theme`, `colors` (`primary`, `light`), `logo`, `favicon`, `description`, and `navigation` with `tabs`, `dropdowns`, `groups`, `pages`, page objects (`{ page, title }`), and grouped pages (`{ group, pages, root }`). `versions` and `languages` resolve to their default entry.

The full `docs.json` standard is described in [`docs.schema.json`](./docs.schema.json). Shiso implements the subset above today; the rest of the schema is the roadmap.

## Components

Markdown content can use the built-in docs components without imports: `Accordion`, `AccordionGroup`, `Badge`, `Callout`, `Note`, `Tip`, `Warning`, `Info`, `Check`, `Danger`, `Card`, `CardGroup`, `CodeGroup`, `Columns`, `Column`, `Expandable`, `Frame`, `Icon`, `ParamField`, `Param`, `RequestExample`, `ResponseExample`, `ResponseField`, `Steps`, `Step`, `Tabs`, `Tab`, `Tooltip`.

`Icon`, `Card`, `Callout`, and `Accordion` accept [lucide](https://lucide.dev/icons) icon names (`icon="rocket"`). Names are collected from your content at build time into `src/lib/icon-registry.generated.ts` — regenerated automatically by the dev server and build, or manually with `pnpm icons:registry`.

## Common commands

```bash
pnpm dev      # dev server at http://localhost:8001
pnpm build    # static site to dist/client
pnpm preview  # preview the built site
pnpm lint
```

## License

MIT
