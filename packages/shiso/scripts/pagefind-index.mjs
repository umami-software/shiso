/**
 * Generates a Pagefind index over the prerendered HTML.
 *
 * Runs after `prerender.mjs` as the final step of `shiso build`, from the
 * project root. It is a no-op unless docs.json resolves `search.provider`
 * to "pagefind". Only pages carrying `data-pagefind-body` (the doc
 * `<article>`) are indexed, so redirect stubs and the 404 page are skipped
 * automatically.
 *
 * The base subdirectory of dist/client is indexed (not dist/client itself)
 * so the recorded URLs are base-relative — the runtime provider hands them
 * to a router whose `basename` re-applies the deploy base.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { loadDocsConfig } from './load-docs-config.mjs';

const root = process.cwd();
const clientDir = path.join(root, 'dist', 'client');

const { config } = await loadDocsConfig({ root });

const search = config.search;
const provider =
  search === false
    ? ''
    : String(search?.provider || 'local')
        .trim()
        .toLowerCase();

if (provider !== 'pagefind') {
  process.exit(0);
}

let pagefind;

try {
  pagefind = await import('pagefind');
} catch (error) {
  if (error?.code === 'ERR_MODULE_NOT_FOUND') {
    console.error(
      'search.provider is "pagefind" but the "pagefind" package is not installed.\n' +
        'It is an optional dependency of @umami/shiso — install it in your project:\n\n' +
        '  pnpm add -D pagefind\n',
    );
    process.exit(1);
  }

  throw error;
}

/** Vite's `base`, normalized to "" or "/prefix". Mirrors prerender.mjs. */
function readBase(template) {
  const match = template.match(/<script[^>]+src="([^"]*)\/assets\//);
  const base = match?.[1] ?? '';
  return base === '/' ? '' : base;
}

const template = await readFile(path.join(clientDir, 'index.html'), 'utf8');
const base = readBase(template);
const indexRoot = path.join(clientDir, ...base.split('/').filter(Boolean));
const outputPath = path.join(indexRoot, 'pagefind');

// The permalink "#" appended to every heading (rehype-autolink-headings in
// mdx.config.ts) must not leak into indexed titles and excerpts.
const DEFAULT_EXCLUDE_SELECTORS = ['.heading-anchor'];

const searchOptions = search && typeof search === 'object' ? search.options || {} : {};
const excludeSelectors = [
  ...DEFAULT_EXCLUDE_SELECTORS,
  ...(Array.isArray(searchOptions.excludeSelectors) ? searchOptions.excludeSelectors : []),
];

const { index, errors: createErrors } = await pagefind.createIndex({ excludeSelectors });

if (!index) {
  console.error(`Pagefind index creation failed:\n${(createErrors || []).join('\n')}`);
  process.exit(1);
}

const { page_count, errors } = await index.addDirectory({ path: indexRoot, glob: '**/*.html' });

if (errors?.length) {
  console.error(`Pagefind indexing failed:\n${errors.join('\n')}`);
  await pagefind.close();
  process.exit(1);
}

if (!page_count) {
  console.error(
    'Pagefind indexed 0 pages. Expected prerendered pages with a data-pagefind-body attribute ' +
      `under ${path.relative(root, indexRoot)}.`,
  );
  await pagefind.close();
  process.exit(1);
}

const { errors: writeErrors } = await index.writeFiles({ outputPath });

if (writeErrors?.length) {
  console.error(`Pagefind bundle write failed:\n${writeErrors.join('\n')}`);
  await pagefind.close();
  process.exit(1);
}

await pagefind.close();

// `addDirectory` counts scanned files; the entry manifest counts pages that
// actually carried `data-pagefind-body` and made it into the index.
const entry = JSON.parse(await readFile(path.join(outputPath, 'pagefind-entry.json'), 'utf8'));
const indexedPages = Object.values(entry.languages || {}).reduce(
  (total, language) => total + (language.page_count || 0),
  0,
);

if (!indexedPages) {
  console.error(
    'Pagefind indexed 0 pages. Expected prerendered pages with a data-pagefind-body attribute ' +
      `under ${path.relative(root, indexRoot)}.`,
  );
  process.exit(1);
}

console.log(`Pagefind indexed ${indexedPages} pages into ${path.relative(root, outputPath)}`);
