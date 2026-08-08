# Shiso

Shiso is an open-source static documentation generator built with Vite, React, and MDX. Site configuration lives in `docs.json`, and documentation content lives in Markdown or MDX files.

For configuration, content authoring, and component usage, see the [Shiso documentation](https://shiso.umami.is).

## Installation

```bash
pnpm create shiso-app my-docs
cd my-docs
pnpm dev
```

With npm, run `npm create shiso-app@latest my-docs` instead. The generator
creates a standalone project with a fresh Git repository and no remote tied to
the Shiso source repository.

The development server runs at `http://localhost:8001`. With the default
configuration, documentation is available at `http://localhost:8001/docs`.

## Project layout

```text
content/docs/   Markdown and MDX source files
scripts/        Validation and build-time generators
src/            React application and rendering code
packages/create-shiso-app/  Project generator published to npm
docs.json       Site configuration and navigation
docs.schema.json  JSON Schema for docs.json
mdx.config.ts   MDX processing pipeline
vite.config.ts  Development and build plugins
```

Add `"$schema": "./docs.schema.json"` to `docs.json` for editor validation and autocomplete. Navigation entries must resolve to files in the configured content directory; missing files fail validation.

## UI components

Prefer the shadcn primitives in `src/components/ui` whenever an equivalent exists. Add new
primitives through the configured Base UI registry instead of recreating them locally:

```bash
pnpm dlx shadcn@latest add <component>
```

Feature and MDX components can wrap these primitives to preserve their public APIs and styling.

## Build pipeline

```bash
pnpm build
```

The production build:

1. Validates `docs.json` against `docs.schema.json`.
2. Generates the icon registry, last-modified metadata, and client-side search index.
3. Builds the browser application into `dist/client`.
4. Builds the server renderer into `dist/server`.
5. Prerenders every documentation route to static HTML in `dist/client`.

Deploy `dist/client` to any static host. For subpath deployments, set Vite's `base` option in `vite.config.ts` before building.

Vercel deployments use the included `vercel.json` to serve `dist/client` as a pre-rendered static site.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Vite development server on port 8001 |
| `pnpm build` | Validate, build, and prerender the static site |
| `pnpm preview` | Preview the production client build |
| `pnpm check:config` | Validate `docs.json` |
| `pnpm lint` | Run Biome checks |
| `pnpm test` | Run the Vitest suite |
| `pnpm icons:registry` | Regenerate the content icon registry |
| `pnpm timestamps` | Regenerate last-modified metadata |
| `pnpm search:index` | Regenerate the client-side search index |

Generated source modules are refreshed automatically during development and production builds. They should not be edited by hand.

## License

MIT
