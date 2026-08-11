import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import docsConfig from './docs.json' with { type: 'json' };
import { shisoMdx } from './mdx.config.ts';
import { generateIconRegistry } from './scripts/generate-icon-registry.mjs';
import { shisoLastModified } from './scripts/generate-last-modified.mjs';
import { generateSearchIndex } from './scripts/generate-search-index.mjs';

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
 * Keeps src/lib/search-index.generated.ts in sync with content, so the search
 * dialog can query page text without a server.
 */
function shisoSearchIndex(): Plugin {
  const enabled = (docsConfig as { search?: unknown }).search !== false;

  return {
    name: 'shiso-search-index',
    async buildStart() {
      if (enabled) {
        await generateSearchIndex();
      }
    },
    async handleHotUpdate({ file }) {
      if (enabled && (/\.(md|mdx)$/.test(file) || file.endsWith('docs.json'))) {
        await generateSearchIndex();
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

interface FontSpec {
  family?: string;
  weight?: number;
  source?: string;
  format?: string;
}

interface FontsOption extends FontSpec {
  heading?: FontSpec;
  body?: FontSpec;
}

/** Stylesheet URL for every configured Google Font (any spec without a `source`). */
function googleFontsUrl(specs: FontSpec[]): string | null {
  const families = new Map<string, Set<number>>();

  for (const spec of specs) {
    if (!spec.family || spec.source) {
      continue;
    }

    const weights = families.get(spec.family) || new Set([400, 700]);

    if (spec.weight) {
      weights.add(spec.weight);
    }

    families.set(spec.family, weights);
  }

  if (!families.size) {
    return null;
  }

  const query = [...families]
    .map(([family, weights]) => {
      const sorted = [...weights].sort((a, b) => a - b);
      return `family=${family.trim().replace(/ +/g, '+')}:wght@${sorted.join(';')}`;
    })
    .join('&');

  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}

/** @font-face rule for a self-hosted font spec. */
function fontFaceRule(spec: FontSpec): string {
  const format = spec.format || (spec.source?.endsWith('.woff') ? 'woff' : 'woff2');

  return (
    `@font-face{font-family:'${spec.family}';src:url(${spec.source}) format('${format}');` +
    `font-weight:${spec.weight || 400};font-display:swap;}`
  );
}

/** CSS custom-property overrides from `colors`, `fonts`, and `background`. */
function buildThemeCss(config: typeof docsConfig): string {
  const { colors, background } = config as {
    colors?: { primary?: string; light?: string; dark?: string };
    background?: {
      image?: string | { light?: string; dark?: string };
      color?: { light?: string; dark?: string };
    };
  };
  const fonts = (config as { fonts?: FontsOption }).fonts;

  const root: string[] = [];
  const dark: string[] = [];
  const extra: string[] = [];

  const lightModePrimary = colors?.primary || colors?.dark;

  if (lightModePrimary) {
    root.push(`--primary:${lightModePrimary};`);
    root.push(`--ring:${lightModePrimary};`);
    root.push(`--sidebar-primary:${lightModePrimary};`);
    root.push(`--sidebar-ring:${lightModePrimary};`);
  }

  // Shadcn uses one semantic primary token for high-emphasis actions and
  // active accents. `dark` supplies the accent when `primary` is omitted.
  const darkModeAccent = colors?.light || colors?.primary || colors?.dark;

  if (darkModeAccent) {
    dark.push(`--primary:${darkModeAccent};`);
    dark.push(`--ring:${darkModeAccent};`);
    dark.push(`--sidebar-primary:${darkModeAccent};`);
    dark.push(`--sidebar-ring:${darkModeAccent};`);
  }

  if (fonts) {
    const body = fonts.body?.family ? fonts.body : fonts;
    const heading = fonts.heading?.family ? fonts.heading : fonts;

    for (const spec of [fonts, fonts.heading, fonts.body]) {
      if (spec?.family && spec.source) {
        extra.push(fontFaceRule(spec));
      }
    }

    if (body.family) {
      root.push(`--font-sans:'${body.family}',system-ui,-apple-system,'Segoe UI',sans-serif;`);
    }

    if (body.weight) {
      root.push(`--font-body-weight:${body.weight};`);
    }

    if (heading.family) {
      root.push(
        `--font-heading:'${heading.family}',system-ui,-apple-system,'Segoe UI',sans-serif;`,
      );
    }

    if (heading.weight) {
      root.push(`--font-heading-weight:${heading.weight};`);
    }
  }

  if (background?.color?.light) {
    root.push(`--background:${background.color.light};`);
  }

  if (background?.color?.dark) {
    dark.push(`--background:${background.color.dark};`);
  }

  if (background?.image) {
    const image = background.image;
    const base = 'background-size:cover;background-attachment:fixed;background-position:center;';

    if (typeof image === 'string') {
      extra.push(`body{background-image:url(${image});${base}}`);
    } else {
      if (image.light) {
        extra.push(`body{background-image:url(${image.light});${base}}`);
      }

      if (image.dark) {
        extra.push(`[data-theme="dark"] body{background-image:url(${image.dark});${base}}`);
      }
    }
  }

  return [
    root.length ? `:root{${root.join('')}}` : '',
    dark.length ? `[data-theme="dark"]{${dark.join('')}}` : '',
    ...extra,
  ]
    .filter(Boolean)
    .join('');
}

function shisoHtml(): Plugin {
  return {
    name: 'shiso-html',
    transformIndexHtml(html) {
      const name = docsConfig.name?.trim();
      const description = (docsConfig as { description?: string }).description;
      const favicon = (docsConfig as { favicon?: string }).favicon;
      const appearance = (docsConfig as { appearance?: { default?: string; strict?: boolean } })
        .appearance;
      const fonts = (docsConfig as { fonts?: FontsOption }).fonts;

      const defaults = [
        DEFAULT_HEAD_OPEN,
        name ? `<title>${name}</title>` : '',
        description ? `<meta name="description" content="${description}" />` : '',
        DEFAULT_HEAD_CLOSE,
      ]
        .filter(Boolean)
        .join('');

      const tags: unknown[] = [];

      if (favicon) {
        tags.push({ tag: 'link', attrs: { rel: 'icon', href: favicon }, injectTo: 'head' });
      }

      const fontsUrl = googleFontsUrl(
        [fonts, fonts?.heading, fonts?.body].filter(Boolean) as FontSpec[],
      );

      if (fontsUrl) {
        tags.push(
          {
            tag: 'link',
            attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            injectTo: 'head',
          },
          {
            tag: 'link',
            attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
            injectTo: 'head',
          },
          { tag: 'link', attrs: { rel: 'stylesheet', href: fontsUrl }, injectTo: 'head' },
        );
      }

      const themeCss = buildThemeCss(docsConfig);

      if (themeCss) {
        tags.push({ tag: 'style', children: themeCss, injectTo: 'head' });
      }

      // Fill the appearance placeholders in the theme init script.
      const withAppearance = html
        .replace('__SHISO_APPEARANCE_DEFAULT__', appearance?.default || 'system')
        .replace('__SHISO_APPEARANCE_STRICT__', appearance?.strict === true ? 'true' : 'false');

      // The marker block goes in as raw HTML rather than as a `tags` entry so
      // the comments survive: Vite's tag descriptors cannot express them.
      return {
        html: withAppearance.replace('</head>', `${defaults}\n</head>`),
        tags: tags as never,
      };
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    shisoIconRegistry(),
    shisoLastModified(),
    shisoSearchIndex(),
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
