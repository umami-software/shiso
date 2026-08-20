# Changelog

All notable changes to `@umami/shiso` are documented here. This project follows
[Semantic Versioning](https://semver.org/).

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
