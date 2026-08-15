# Changelog

All notable changes to `create-shiso-app` are documented here. This project follows
[Semantic Versioning](https://semver.org/).

## 0.3.0 - 2026-08-15

### Changed

- New projects install `@umami/shiso` 1.x as an upgradeable dependency.
- The supported Node.js range now matches the framework and Vite:
  `^20.19.0 || >=22.12.0`.

## 0.2.0 - 2026-08-13

### Changed

- Generated projects now install Shiso as an upgradeable framework dependency.
- Starters contain only user-owned content, configuration, assets, and a client entry point.
- Framework rendering, build scripts, schema validation, and generated caches are no longer copied.

## 0.1.0 - 2026-08-09

### Added

- Initial public release of the Shiso project generator.
- Package-manager detection with explicit npm, pnpm, Yarn, and Bun overrides.
- Optional dependency installation and Git repository initialization.
- A starter documentation site with search, theming, MDX components, static prerendering,
  Markdown exports, and deployment configuration.
