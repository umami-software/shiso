/**
 * Generates the project-local .shiso/search-index.generated.ts cache.
 *
 * Client-side search needs the plain text of every page, which only exists in
 * the MDX sources at build time. Each navigable page is parsed to mdast and
 * split into heading-bounded sections; headings share the slug algorithm with
 * rehype-slug (src/lib/slug.ts), so result anchors always match rendered ids.
 *
 * Pages marked `hidden` in navigation are excluded, matching their exclusion
 * from the sidebar and sitemap.
 *
 * Run via `pnpm search:index`, or automatically by the Vite plugin in
 * vite.config.ts. The generated module is dynamically imported by the search
 * dialog, so Vite splits it out of the initial bundle.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { headingText } from '../src/lib/mdast.ts';
import { createSlugger, slugifyId } from '../src/lib/slug.ts';
import { loadDocsConfig } from './load-docs-config.mjs';

const DEFAULT_ROOT = process.cwd();

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter).use(remarkGfm);

/** Mirrors normalizePageReference in src/lib/docs-config.ts. */
function normalizePageReference(pageRef) {
  const value = pageRef
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^docs\//, '')
    .replace(/\.mdx?$/, '')
    .replace(/\/+$/, '');

  if (!value) {
    return { fileSlug: 'index', slug: 'index' };
  }

  return {
    fileSlug: value,
    slug: value === 'index' ? 'index' : value.replace(/\/index$/, '') || 'index',
  };
}

/**
 * One entry per navigation scope, mirroring collectScopeSources in
 * src/lib/docs-config.ts: ordinary navigation, versions, languages, and
 * versions nested inside languages. Hidden scopes are excluded from search,
 * matching how hidden pages are excluded.
 */
function collectScopes(navigation) {
  if (Array.isArray(navigation.versions)) {
    return navigation.versions
      .filter(version => !version.hidden)
      .map(version => ({
        id: slugifyId(version.version?.trim() || '', 'scope'),
        version: version.version?.trim(),
        container: version,
      }));
  }

  if (Array.isArray(navigation.languages)) {
    return navigation.languages
      .filter(language => !language.hidden)
      .flatMap(language => {
        const languageLabel = language.language?.trim();

        if (Array.isArray(language.versions)) {
          return language.versions
            .filter(version => !version.hidden)
            .map(version => ({
              id: slugifyId(`${languageLabel}-${version.version?.trim()}`, 'scope'),
              language: languageLabel,
              version: version.version?.trim(),
              container: version,
            }));
        }

        return [
          {
            id: slugifyId(languageLabel || '', 'scope'),
            language: languageLabel,
            container: language,
          },
        ];
      });
  }

  return [{ id: 'default', container: navigation }];
}

/**
 * Collects `{ fileSlug, slug }` for every non-hidden page in the navigation
 * tree. A simplified mirror of the config walker: search only needs page refs
 * and hidden inheritance, not labels or ordering.
 */
function collectVisiblePages(container, pages = [], hidden = false) {
  const items = [
    ...(container.pages || []),
    ...(container.groups || []),
    ...(container.tabs || []),
    ...(container.dropdowns || []),
  ];

  for (const item of items) {
    if (typeof item === 'string') {
      if (!hidden) {
        pages.push(normalizePageReference(item));
      }
      continue;
    }

    if (!item || typeof item !== 'object') {
      continue;
    }

    const itemHidden = hidden || item.hidden === true;

    if (typeof item.page === 'string') {
      if (!itemHidden) {
        pages.push(normalizePageReference(item.page));
      }
      continue;
    }

    if (typeof item.root === 'string' && !itemHidden) {
      pages.push(normalizePageReference(item.root));
    }

    collectVisiblePages(item, pages, itemHidden);
  }

  return pages;
}

/** Frontmatter is YAML, but search only needs the title line. */
function frontmatterTitle(tree) {
  const yaml = tree.children?.find(node => node.type === 'yaml');
  const match = yaml?.value?.match(/^title:\s*(.+)$/m);
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : undefined;
}

/** Node types whose children are separate blocks, so their text needs a space between. */
const BLOCK_TYPES = new Set([
  'root',
  'list',
  'listItem',
  'table',
  'tableRow',
  'tableCell',
  'blockquote',
  'mdxJsxFlowElement',
]);

/** Like toText in src/lib/mdast.ts, but block children are space-separated. */
function blockText(node) {
  if (typeof node.value === 'string') {
    return node.value;
  }

  const separator = BLOCK_TYPES.has(node.type) ? ' ' : '';
  return (node.children || []).map(blockText).join(separator);
}

/** Splits a document into heading-bounded sections of plain text. */
function collectSections(tree) {
  const slugger = createSlugger();
  const sections = [{ heading: undefined, id: undefined, parts: [] }];

  for (const node of tree.children || []) {
    if (node.type === 'yaml' || node.type === 'mdxjsEsm') {
      continue;
    }

    if (node.type === 'heading') {
      const heading = headingText(node);
      sections.push({ heading, id: slugger.slug(heading), parts: [] });
      continue;
    }

    const text = blockText(node).replace(/\s+/g, ' ').trim();

    if (text) {
      sections.at(-1).parts.push(text);
    }
  }

  return sections
    .map(({ heading, id, parts }) => ({ heading, id, text: parts.join(' ') }))
    .filter(section => section.heading || section.text);
}

/** @param {{ config?: object, root?: string, output?: string }} [options] */
export async function generateSearchIndex({
  config,
  root = DEFAULT_ROOT,
  output = path.join(root, '.shiso/search-index.generated.ts'),
} = {}) {
  const docsJson = config ?? (await loadDocsConfig({ root })).config;
  const docsPrefix = (docsJson.$shiso?.docsPrefix ?? '/docs').replace(/\/+$/, '');
  const contentDir = (docsJson.$shiso?.contentDir ?? 'content/docs').replace(/^\/+|\/+$/g, '');

  const seen = new Set();
  const records = [];

  for (const scope of collectScopes(docsJson.navigation || {})) {
    // Single-scope sites omit scope fields so their index stays unchanged.
    const scopeFields =
      scope.id === 'default'
        ? {}
        : { scopeId: scope.id, language: scope.language, version: scope.version };

    for (const { fileSlug, slug } of collectVisiblePages(scope.container)) {
      if (seen.has(fileSlug)) {
        continue;
      }

      seen.add(fileSlug);

      let source;
      let filePath;

      for (const extension of ['mdx', 'md']) {
        filePath = path.join(root, contentDir, `${fileSlug}.${extension}`);
        source = await fs.readFile(filePath, 'utf8').catch(() => undefined);

        if (source !== undefined) {
          break;
        }
      }

      if (source === undefined) {
        // Missing files fail config normalization; search just skips them.
        continue;
      }

      const tree = parser.parse(source);
      const url = slug === 'index' ? docsPrefix || '/' : `${docsPrefix}/${slug}`;
      const page = frontmatterTitle(tree) || fileSlug;

      for (const { heading, id, text } of collectSections(tree)) {
        records.push({ url, page, heading, id, text, ...scopeFields });
      }
    }
  }

  // Emitted in the repo's formatter style (single quotes, bare keys, trailing
  // commas) so the generated file passes `biome check` unchanged.
  const quote = value => {
    const escaped = value.replace(/\\/g, '\\\\');
    const singles = (value.match(/'/g) || []).length;
    const doubles = (value.match(/"/g) || []).length;

    // Like the formatter: whichever quote needs fewer escapes, single on ties.
    return singles > doubles
      ? `"${escaped.replace(/"/g, '\\"')}"`
      : `'${escaped.replace(/'/g, "\\'")}'`;
  };
  const body = records
    .map(record => {
      const fields = Object.entries(record)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `    ${key}: ${quote(value)},`)
        .join('\n');

      return `  {\n${fields}\n  },`;
    })
    .join('\n');

  const contents = `// Generated by scripts/generate-search-index.mjs. Do not edit by hand.
import type { SearchRecord } from '@/lib/search';

export const SEARCH_INDEX: SearchRecord[] = [
${body}
];
`;

  const previous = await fs.readFile(output, 'utf8').catch(() => '');

  if (previous !== contents) {
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, contents);
  }

  return { pages: seen.size, records: records.length, changed: previous !== contents };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const { pages, records } = await generateSearchIndex();
  console.log(`Search index: ${records} sections across ${pages} pages`);
}
