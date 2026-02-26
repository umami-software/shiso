# Shiso

Shiso is built with [Next.js](https://nextjs.org/) and MDX.
It is designed to run as your docs site directly (similar to Fumadocs/Nextra workflows), not as an embeddable package.

## Quick start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:8001/docs`.

## How it works

- Docs navigation lives in `src/docs.json`
- Docs content lives in `content/docs/**/*.mdx` (or `.md`)
- The docs route is `src/app/docs/[[...slug]]/page.tsx`

Every page in `src/docs.json` navigation must map to a real file in `content/docs`.

## Common commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## License

MIT
