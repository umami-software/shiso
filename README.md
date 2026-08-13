# Shiso

Shiso turns Markdown files into a fast, searchable documentation website. Use
it for product guides, help centers, API documentation, or any other content
that benefits from clear navigation and a polished reading experience.

Shiso includes:

- navigation with tabs, groups, and nested pages
- light and dark modes with customizable colors, fonts, and branding
- built-in search with no external service required
- SEO metadata, sitemaps, redirects, and custom 404 pages
- Markdown copies of every page and optional actions for AI assistants
- static output that can be hosted almost anywhere

## Create a documentation site

```bash
pnpm create shiso-app@latest my-docs
cd my-docs
pnpm dev
```

Open the local URL shown in your terminal to view the site.

Shiso is installed as a project dependency. Upgrade the framework later with
`pnpm update shiso`; you do not need to recreate the project.

## Add and organize pages

Write pages as Markdown or MDX files in `content/docs`:

```mdx
---
title: Getting started
description: Learn the basics in a few minutes.
---

Welcome to the documentation.
```

Add each page to `navigation` in `docs.json` to choose its position in the
sidebar:

```json
{
  "$schema": "./node_modules/shiso/docs.schema.json",
  "name": "Acme Docs",
  "navigation": {
    "groups": [
      {
        "group": "Getting started",
        "pages": ["index", "installation"]
      }
    ]
  }
}
```

The page name matches its file path without the extension. For example,
`"installation"` uses `content/docs/installation.mdx`.

## Customize your site

Use `docs.json` to set your logo, colors, navigation, header and footer links,
search, SEO, redirects, and other site-wide options. Add images, fonts, and
other files to `public` and reference them with paths such as `/logo.svg`.

See the [configuration overview](https://shiso.umami.is/docs/configuration) for all
available sections and examples.

## Build and publish

```bash
pnpm build
```

The finished static site is written to `dist/client`. Publish that folder with
your preferred static hosting provider.

For hosting setup and deployment checks, see the
[deployment guide](https://shiso.umami.is/docs/guides/deployment).

## Documentation

- [Installation](https://shiso.umami.is/docs/installation)
- [Configuration](https://shiso.umami.is/docs/configuration)
- [Writing content](https://shiso.umami.is/docs/writing-content)
- [Troubleshooting](https://shiso.umami.is/docs/troubleshooting)

## License

MIT
