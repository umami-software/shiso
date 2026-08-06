import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import docsConfig from './docs.json' with { type: 'json' };
import { shisoMdx } from './mdx.config.ts';
import { generateIconRegistry } from './scripts/generate-icon-registry.mjs';

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
 * Injects site-level metadata from docs.json into index.html: the fallback
 * title, favicon, and theme color CSS variables.
 *
 * The title/description defaults are wrapped in marker comments because
 * prerendered pages supply their own (src/lib/head.ts) and the duplicates have
 * to be removed. Deleting a delimited block is deterministic; the regex over
 * `<title>` this replaced was not.
 */
const DEFAULT_HEAD_OPEN = '<!--shiso-default-head-->';
const DEFAULT_HEAD_CLOSE = '<!--/shiso-default-head-->';

function shisoHtml(): Plugin {
  return {
    name: 'shiso-html',
    transformIndexHtml(html) {
      const name = docsConfig.name || 'Shiso';
      const description = (docsConfig as { description?: string }).description;
      const favicon = (docsConfig as { favicon?: string }).favicon;
      const colors = (
        docsConfig as { colors?: { primary?: string; light?: string; dark?: string } }
      ).colors;

      const defaults = [
        DEFAULT_HEAD_OPEN,
        `<title>${name}</title>`,
        description ? `<meta name="description" content="${description}" />` : '',
        DEFAULT_HEAD_CLOSE,
      ]
        .filter(Boolean)
        .join('');

      const tags: unknown[] = [];

      if (favicon) {
        tags.push({ tag: 'link', attrs: { rel: 'icon', href: favicon }, injectTo: 'head' });
      }

      if (colors?.primary || colors?.light || colors?.dark) {
        const light = colors.light || colors.primary;
        const rules = [
          colors.primary ? `:root{--color-primary:${colors.primary};}` : '',
          light ? `[data-theme="dark"]{--color-primary:${light};}` : '',
        ]
          .filter(Boolean)
          .join('');

        tags.push({ tag: 'style', children: rules, injectTo: 'head' });
      }

      // The marker block goes in as raw HTML rather than as a `tags` entry so
      // the comments survive: Vite's tag descriptors cannot express them.
      return { html: html.replace('</head>', `${defaults}\n</head>`), tags: tags as never };
    },
  };
}

export default defineConfig({
  plugins: [
    shisoIconRegistry(),
    shisoHtml(),
    shisoMdx(),
    react({ include: /\.(mdx|md|tsx|ts|jsx|js)$/ }),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
