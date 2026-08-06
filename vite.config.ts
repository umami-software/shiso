import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig, type Plugin } from 'vite';
import docsConfig from './docs.json';
import { generateIconRegistry } from './scripts/generate-icon-registry.mjs';
import { remarkToc } from './src/lib/remark-toc';

/**
 * Keeps src/lib/icon-registry.generated.ts in sync with the `icon="name"` values
 * used in content, so string icon names resolve without bundling all of lucide.
 */
function shisoIconRegistry(): Plugin {
  return {
    name: 'shiso-icon-registry',
    async buildStart() {
      const { unknown } = await generateIconRegistry();

      if (unknown.length) {
        this.warn(`Unknown icon names (not in lucide): ${unknown.join(', ')}`);
      }
    },
    async handleHotUpdate({ file }) {
      if (/\.(md|mdx|tsx)$/.test(file)) {
        await generateIconRegistry();
      }
    },
  };
}

/**
 * Injects site-level metadata from docs.json into index.html:
 * default title, favicon, and theme color CSS variables.
 * Per-page titles/descriptions are injected by scripts/prerender.mjs.
 */
function shisoHtml(): Plugin {
  return {
    name: 'shiso-html',
    transformIndexHtml(html) {
      const name = docsConfig.name || 'Shiso';
      const favicon = (docsConfig as { favicon?: string }).favicon;
      const colors = (
        docsConfig as { colors?: { primary?: string; light?: string; dark?: string } }
      ).colors;

      const tags = [{ tag: 'title', children: name, injectTo: 'head' as const }];

      if (favicon) {
        tags.push({
          tag: 'link',
          attrs: { rel: 'icon', href: favicon },
          injectTo: 'head',
        } as never);
      }

      if (colors?.primary || colors?.light || colors?.dark) {
        const light = colors.light || colors.primary;
        const rules = [
          colors.primary ? `:root{--color-primary:${colors.primary};}` : '',
          light ? `[data-theme="dark"]{--color-primary:${light};}` : '',
        ]
          .filter(Boolean)
          .join('');

        tags.push({ tag: 'style', children: rules, injectTo: 'head' } as never);
      }

      return { html, tags };
    },
  };
}

export default defineConfig({
  plugins: [
    shisoIconRegistry(),
    shisoHtml(),
    {
      // Must run before vite:react-babel so MDX is compiled to JSX first.
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm, remarkToc],
        rehypePlugins: [rehypeHighlight, rehypeSlug],
      }),
    },
    react({ include: /\.(mdx|md|tsx|ts|jsx|js)$/ }),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
