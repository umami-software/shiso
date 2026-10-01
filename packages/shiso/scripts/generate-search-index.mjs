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
import { loadDocsNavigation } from './lib/docs-navigation.mjs';
import { headingText } from './lib/mdast.mjs';
import { loadApiProject } from './lib/openapi-project.mjs';
import {
  interpretReferencePage,
  readReferenceFrontmatter,
  referenceSearchSections,
} from './lib/reference-page.mjs';
import { createSlugger } from './lib/slug.mjs';
import { loadDocsConfig } from './load-docs-config.mjs';
import { loadShisoConfig } from './load-shiso-config.mjs';

const DEFAULT_ROOT = process.cwd();

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter).use(remarkGfm);

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

/** @param {{ config?: object, shiso?: object, project?: object, root?: string, output?: string }} [options] */
export async function generateSearchIndex({
  config,
  shiso,
  project: preparedProject,
  root = DEFAULT_ROOT,
  output = path.join(root, '.shiso/search-index.generated.ts'),
} = {}) {
  const loaded = config ? undefined : await loadDocsConfig({ root, shiso });
  const docsJson = config ?? loaded.config;
  const { docsPrefix, contentDir } = shiso ?? (await loadShisoConfig({ root })).config;

  const records = [];
  let pageCount = 0;
  const { site, missingPages } = loadDocsNavigation({
    root,
    config: docsJson,
    shiso: { docsPrefix, contentDir },
  });

  // Pages bound to an API operation get synthesized sections from the spec, so
  // parameters and responses are searchable even though they render from data.
  const project = docsJson.api?.spec
    ? (preparedProject ?? loaded?.apiProject ?? (await loadApiProject({ root, api: docsJson.api })))
    : undefined;

  for (const scope of site.scopes) {
    if (scope.hidden) continue;
    // Single-scope sites omit scope fields so their index stays unchanged.
    const scopeFields =
      scope.id === 'default'
        ? {}
        : { scopeId: scope.id, language: scope.language, version: scope.version };

    for (const { fileSlug, filePath, url, hidden } of scope.docs.pages) {
      if (hidden || missingPages.has(fileSlug)) continue;
      const source = await fs.readFile(filePath, 'utf8');
      pageCount += 1;

      const tree = parser.parse(source);
      const page = frontmatterTitle(tree) || fileSlug;

      for (const { heading, id, text } of collectSections(tree)) {
        records.push({ url, page, heading, id, text, ...scopeFields });
      }

      const reference = interpretReferencePage(readReferenceFrontmatter(source), project, {
        playground: docsJson.api?.playground,
      });
      for (const { heading, id, text } of referenceSearchSections(reference)) {
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

  return { pages: pageCount, records: records.length, changed: previous !== contents };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const { pages, records } = await generateSearchIndex();
  console.log(`Search index: ${records} sections across ${pages} pages`);
}
