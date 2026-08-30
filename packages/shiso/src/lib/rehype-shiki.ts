/**
 * Highlights fenced code blocks with Shiki at build time.
 *
 * Output contract (consumed by `components/CodeBlock.tsx` and global.css):
 * - `<pre>` carries `data-language`, and when present `data-title`,
 *   `data-line-numbers`, `data-line-start`, `data-line-count`, `data-diff-markers`.
 * - `<code class="language-x">` keeps its class; its children are Shiki's
 *   `<span class="line">` elements, each optionally marked `data-highlighted`
 *   or `data-diff="add|remove"`.
 * - Token spans carry only `--shiki-light` / `--shiki-dark` variables so the
 *   markup is identical in both color modes and CSS picks the theme.
 */

import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';
import {
  bundledLanguages,
  bundledThemes,
  createHighlighter,
  type Highlighter,
  type ShikiTransformer,
} from 'shiki';
// Relative imports: this module is also loaded by vite.config.ts, which esbuild
// bundles without applying the '@/' resolve alias.
import { parseCodeMeta } from './code-meta.ts';
import { type MdNode, toText, walkTree } from './mdast.ts';
import type { ResolvedCodeBlockConfig } from './types.ts';

type Properties = Record<string, unknown>;

const highlighters = new Map<string, Promise<Highlighter>>();
const languageLoads = new Map<string, Promise<void>>();
const warnedLanguages = new Set<string>();

function assertTheme(name: string, key: 'light' | 'dark') {
  if (!(name in bundledThemes)) {
    throw new Error(
      `[shiso] Unknown code theme "${name}" in docs.json styling.codeBlocks.theme.${key}. ` +
        'Use a bundled Shiki theme name (https://shiki.style/themes).',
    );
  }
}

function getHighlighter(theme: ResolvedCodeBlockConfig['theme']): Promise<Highlighter> {
  const key = `${theme.light}|${theme.dark}`;
  let highlighter = highlighters.get(key);

  if (!highlighter) {
    assertTheme(theme.light, 'light');
    assertTheme(theme.dark, 'dark');
    highlighter = createHighlighter({ themes: [theme.light, theme.dark], langs: [] });
    highlighters.set(key, highlighter);
  }

  return highlighter;
}

async function ensureLanguage(highlighter: Highlighter, lang: string) {
  if (highlighter.getLoadedLanguages().includes(lang)) {
    return;
  }

  let load = languageLoads.get(lang);
  if (!load) {
    load = highlighter.loadLanguage(lang as keyof typeof bundledLanguages);
    languageLoads.set(lang, load);
  }

  await load;
}

function resolveLanguage(requested: string | undefined): string {
  if (!requested || requested === 'text' || requested === 'plaintext' || requested === 'txt') {
    return 'text';
  }

  if (requested in bundledLanguages) {
    return requested;
  }

  if (!warnedLanguages.has(requested)) {
    warnedLanguages.add(requested);
    console.warn(`[shiso] No syntax grammar for "${requested}"; rendering it as plain text.`);
  }

  return 'text';
}

/** Marks meta `{1,3-5}` lines and, for `diff` blocks, the added/removed lines. */
function shisoLineMarks(highlight: Set<number>, diffLanguage: boolean): ShikiTransformer {
  return {
    name: 'shiso:line-marks',
    line(node, line) {
      if (highlight.has(line)) {
        node.properties['data-highlighted'] = '';
      }

      if (diffLanguage) {
        const text = toText(node as unknown as MdNode);
        if (/^\+(?!\+\+)/.test(text)) {
          node.properties['data-diff'] = 'add';
        } else if (/^-(?!--)/.test(text)) {
          node.properties['data-diff'] = 'remove';
        }
      }
    },
  };
}

/** Converts transformer classes (`highlighted`, `diff add|remove`) into data attributes. */
function normalizeLine(line: MdNode) {
  const properties = (line.properties || {}) as Properties;
  // Shiki transformers write `class`; mdast-util-to-hast writes `className`.
  const classes = [properties.class, properties.className]
    .flatMap(value => (Array.isArray(value) ? value : String(value || '').split(' ')))
    .map(String)
    .filter(Boolean);

  if (classes.includes('highlighted')) {
    properties['data-highlighted'] = '';
  }
  if (classes.includes('diff')) {
    properties['data-diff'] = classes.includes('remove') ? 'remove' : 'add';
  }

  delete properties.class;
  properties.className = ['line'];
  line.properties = properties;
}

async function highlightBlock(pre: MdNode, code: MdNode, config: ResolvedCodeBlockConfig) {
  const codeProperties = (code.properties || {}) as Properties;
  const classes = Array.isArray(codeProperties.className)
    ? codeProperties.className.map(String)
    : [];
  const requested = classes.map(value => value.match(/^language-(\S+)$/)?.[1]).find(Boolean);
  const lang = resolveLanguage(requested);
  const meta = parseCodeMeta(typeof code.data?.meta === 'string' ? code.data.meta : '');
  // mdast-util-to-hast appends a trailing newline to the code text.
  const source = toText(code).replace(/\n$/, '');

  const highlighter = await getHighlighter(config.theme);
  if (lang !== 'text') {
    await ensureLanguage(highlighter, lang);
  }

  const hast = highlighter.codeToHast(source, {
    lang,
    themes: config.theme,
    defaultColor: false,
    transformers: [
      transformerNotationHighlight({ matchAlgorithm: 'v3' }),
      transformerNotationDiff({ matchAlgorithm: 'v3' }),
      shisoLineMarks(new Set(meta.highlightLines), lang === 'diff'),
    ],
  }) as MdNode;

  // root > pre > code
  const shikiPre = hast.children?.[0] as MdNode;
  const shikiCode = shikiPre?.children?.[0] as MdNode;
  const lines = (shikiCode?.children || []).filter(node => node.tagName === 'span');
  lines.forEach(normalizeLine);

  const hasNotationDiff =
    lang !== 'diff' && lines.some(line => (line.properties as Properties)['data-diff']);
  const showLineNumbers = meta.showLineNumbers ?? config.lineNumbers;

  code.children = shikiCode?.children || [];
  pre.properties = {
    ...(pre.properties as Properties),
    'data-language': lang,
    ...(meta.title ? { 'data-title': meta.title } : {}),
    ...(showLineNumbers ? { 'data-line-numbers': 'true' } : {}),
    ...(meta.startLine ? { 'data-line-start': String(meta.startLine) } : {}),
    'data-line-count': String(lines.length),
    ...(hasNotationDiff ? { 'data-diff-markers': 'true' } : {}),
  };
}

export function rehypeShiki(config: ResolvedCodeBlockConfig) {
  return async (tree: MdNode) => {
    const tasks: Promise<void>[] = [];

    walkTree(tree, pre => {
      if (pre.tagName !== 'pre') {
        return;
      }

      const code = pre.children?.find(child => child.tagName === 'code');
      if (code) {
        tasks.push(highlightBlock(pre, code, config));
      }
    });

    await Promise.all(tasks);
  };
}
