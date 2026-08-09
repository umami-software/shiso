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

## Production

```bash
pnpm build
```

Deploy the generated `dist/client` directory to your static host.
