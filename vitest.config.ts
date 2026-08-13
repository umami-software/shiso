import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { shisoMdx } from './mdx.config.ts';
import { shisoLastModified } from './scripts/generate-last-modified.mjs';
import { createDocsConfigModule } from './scripts/vite-docs-config.mjs';

export default defineConfig(async () => {
  const configModule = await createDocsConfigModule({
    root: fileURLToPath(new URL('.', import.meta.url)),
  });

  return {
    // Tests import src/lib/content.ts, which globs the real content directory, so
    // the runner needs the same config and MDX pipeline the app builds with.
    plugins: [
      configModule.plugin,
      shisoLastModified(),
      shisoMdx(),
      react({ include: /\.(mdx|md|tsx|ts|jsx|js)$/ }),
    ],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    test: {
      include: ['tests/**/*.test.{ts,tsx,mjs}'],
      environment: 'node',
    },
  };
});
