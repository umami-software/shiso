# Changelog

## 1.18.0 - 2026-09-26

### Added

- Translate built-in interface text ("On this page", "Copy page", search, and
  more) per page language, with dictionaries for English, German, Spanish,
  French, Japanese, Simplified Chinese, and Traditional Chinese. Override any
  label per locale with the `translations` option in `shiso.config.ts`.
- Tag standalone pages with a navigation `language`, e.g.
  `{ "path": "/ja", "page": "ja/home", "language": "ja" }`. Tagged pages use
  that language's document locale, header navigation, and language selector.
- Switching languages on a standalone page opens the same page in the chosen
  language, matched by file slug without the language folder (`ja/home` and
  `home`).

### Fixed

- The header logo links to the home page in the current language instead of
  always linking to `/`.
- `shiso check` no longer reports links to a top-level group's `root` page as
  unknown routes.

## 1.17.0 - 2026-09-25

### Changed

- The language selector shows each language by its native name, e.g. "日本語"
  for `ja` and "繁體中文" for `zh-Hant`, instead of the language code.

## 1.15.0 - 2026-09-06

### Fixed

- Generate kebab-case OpenAPI documentation filenames and navigation URLs from
  operation IDs, so `getPixelShares` produces `get-pixel-shares`.
