# My Docs

This documentation site was created with [Shiso](https://shiso.umami.is).

## Development

Install dependencies and start the local development server:

```bash
pnpm install
pnpm dev
```

Open the local URL shown in your terminal, then edit
`content/docs/index.mdx` to start writing.

Site configuration and navigation live in `docs.json`.

## Upgrade Shiso

Shiso is installed as a regular project dependency. Upgrade it independently
of this starter with:

```bash
pnpm update @umami/shiso
```

## Production

```bash
pnpm build
```

Deploy the generated `dist/client` directory to your static host.
