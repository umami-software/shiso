# Changelog

All notable changes to `@umami/shiso` are documented here. This project follows
[Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- `Link` export from `@umami/shiso/components`: a client-side navigation link
  bound to Shiso's router, for TSX standalone pages and other app code.
  Importing `react-router` directly from app code creates a second router
  instance without Shiso's context, so use this instead.
- Public `@umami/shiso/components` entry point for importing Shiso's built-in
  content components from TSX standalone pages and other React modules.
- TSX standalone pages under `content/pages`. Component pages retain Shiso's
  site chrome, metadata, sitemap, and prerendering behavior while owning their
  layout without the `.docs-markdown` typography wrapper. Raw `.md` copies are
  only generated for Markdown and MDX pages.
- `not-prose` escape hatch: elements with the `not-prose` class (and their
  descendants) are excluded from `.docs-markdown` typography styles — headings,
  lists, tables, links, and spacing rules — so embedded UI components render
  with their own styles. Guards use `:not(:where(…))` and add no specificity.
- Per-page `search: false` frontmatter to hide the header search control and
  disable its keyboard shortcut on selected docs or standalone pages.
- Link tabs: a navigation tab may define `href` instead of `groups`/`pages`/
  `dropdowns` to link to a standalone page or external URL from the top
  navigation. Internal hrefs route client-side and highlight when active;
  external URLs open in a new browser tab.

### Fixed

- Let standalone page content expand through the layout's flex chain so short
  pages keep the footer at the bottom of the viewport.
- Bundle `@umami/shiso` entry points into the SSR build (`ssr.noExternal`) so
  TSX standalone pages that import `@umami/shiso/components` prerender
  correctly; previously Node hit the unresolved project-time virtual import
  `@/lib/icon-registry.generated` inside the published chunks.
- Dev server: allow serving raw assets (fonts, images) from Shiso's real
  install location when the framework is linked from outside the project's
  workspace root (`link:`/`file:` installs previously returned 403 for
  bundled font files).

## 2.0.0 - 2026-08-21

### Breaking

- Move project settings (`docsPrefix`, `contentDir`, `siteUrl`, `locale`) from
  the `$shiso` key in docs.json to a new optional `shiso.config.ts` file at the
  project root. `shiso check` now rejects docs.json files that still contain
  `$shiso` with a migration message.

### Added

- New `@umami/shiso/config` export providing `defineConfig` and the
  `ShisoConfig` type for shiso.config.ts.
- `shiso.config.ts`, `shiso.config.mjs`, and `shiso.config.js` are supported;
  the file is optional and defaults apply when absent. Config edits (and
  creating the file) hot-reload during development.

## 1.1.11 - 2026-08-19

### Changed

- Remove rounded corners from full-screen images and anchor the close button to
  the viewport's top-right corner.
- Render the active sidebar page label in bold.

## 1.1.10 - 2026-08-19

### Added

- Add more vertical space around documentation images and open them in an
  accessible full-size viewer when clicked.
- Support `noZoom` on MDX images and disable zoom automatically for linked
  images.

## 1.1.9 - 2026-08-19

### Fixed

- Stop automatically inverting a shared logo in dark mode so PNG and other
  full-color images render unchanged.

## 1.1.8 - 2026-08-19

### Changed

- Replace the custom and Zinc-derived light and dark grayscale theme tokens with
  exact values from Tailwind's Neutral palette.

## 1.1.7 - 2026-08-19

### Fixed

- Remove the nested callout description's leading paragraph margin so the first
  line of text and icon share the same line box.

## 1.1.6 - 2026-08-19

### Fixed

- Apply Alert's optical SVG offset to wrapped callout icons so their visible
  strokes align with the first line of text.

## 1.1.5 - 2026-08-19

### Fixed

- Align callout icons with the first line of text using a fixed line-height box
  that remains consistent in published production builds.
- Keep header actions aligned to the right when the current navigation scope
  does not render top-level tabs.

## 1.1.3 - 2026-08-18

### Fixed

- Publish Shiso's browser and server runtime as bundled ESM instead of exposing
  raw framework source to consuming Vite projects.
- Move `hydrateRoot` into the generated app entry so React DOM is discovered as
  a normal direct app dependency without framework-specific prebundle entries.

## 1.1.2 - 2026-08-18

### Fixed

- Replace the CommonJS-only `classnames` dependency with ESM-capable `clsx` so
  fresh pnpm projects can load Shiso's navigation components during development.

## 1.1.1 - 2026-08-18

### Fixed

- Prebundle Base UI's CommonJS external-store shims so fresh pnpm projects load
  their named exports correctly during development.

## 1.0.0 - 2026-08-15

### Added

- Full multi-version and multi-language navigation, including versions nested
  inside languages and responsive header selectors.
- Per-scope prerendering, Markdown export, sitemap metadata, document locale,
  text direction, and local search results.
- A multi-scope integration fixture covering visible and hidden pages,
  versions, languages, redirects, search, and sitemap output.
- Public exports for the bundled `docs.json` schema.

### Changed

- Navigation containers now require exactly one non-empty navigation mode, and
  default to the first visible version or language when none is marked.
- Hidden versions and languages remain buildable and directly reachable while
  staying out of selectors and search.
- Redirect sources are exact paths; wildcard and parameter patterns are
  rejected during configuration validation.
- Supported Node.js versions now match Vite: `^20.19.0 || >=22.12.0`.

### Fixed

- Client-side navigation now updates page metadata, document language, and
  left-to-right or right-to-left text direction.

## 0.61.0 - 2026-08-13

### Added

- Initial package release of the upgradeable Shiso framework.
- Framework-owned development, validation, build, preview, and prerender commands.
- Project-local generated caches for search, icons, and last-modified metadata.
