# Changelog

All notable changes to `@umami/shiso` are documented here. This project follows
[Semantic Versioning](https://semver.org/).

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
