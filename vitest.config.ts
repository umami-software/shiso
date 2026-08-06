import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { shisoMdx } from './mdx.config.ts';

export default defineConfig({
  // Tests import src/lib/content.ts, which globs the real content directory, so
  // the runner needs the same MDX pipeline the app builds with.
  plugins: [shisoMdx(), react({ include: /\.(mdx|md|tsx|ts|jsx|js)$/ })],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    include: ['tests/**/*.test.{ts,tsx,mjs}'],
    environment: 'node',
  },
});
