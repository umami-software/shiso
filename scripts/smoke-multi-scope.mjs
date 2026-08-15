/**
 * Builds the multi-scope fixture (tests/fixtures/multi-scope) and asserts the
 * complete output of a site with languages, nested versions, hidden entries,
 * anchors, redirects, search, and a sitemap. Run via `pnpm test:multi-scope`.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE_ROOT = path.join(REPOSITORY_ROOT, 'tests/fixtures/multi-scope');
const CLIENT_DIR = path.join(FIXTURE_ROOT, 'dist/client');
const SHISO_BIN = path.join(REPOSITORY_ROOT, 'packages/shiso/bin/shiso.mjs');

const failures = [];

function check(condition, message) {
  if (condition) {
    console.log(`  ok: ${message}`);
  } else {
    failures.push(message);
    console.error(`  FAIL: ${message}`);
  }
}

async function readOutput(relative) {
  return fs.readFile(path.join(CLIENT_DIR, relative), 'utf8').catch(() => null);
}

console.log('\nBuilding the multi-scope fixture...\n');

const result = spawnSync(process.execPath, [SHISO_BIN, 'build'], {
  cwd: FIXTURE_ROOT,
  env: { ...process.env, CI: '1' },
  stdio: 'inherit',
});

if (result.status !== 0) {
  console.error('\nFixture build failed.');
  process.exit(result.status ?? 1);
}

console.log('\nChecking build output...\n');

// Every page of every scope renders to HTML, hidden ones included.
const htmlPages = [
  'docs/index.html',
  'docs/guide/index.html',
  'docs/secret/index.html',
  'docs/v1/index.html',
  'docs/v1/guide/index.html',
  'docs/v0/index.html',
  'docs/es/index.html',
  'docs/es/guide/index.html',
  'docs/es/v1/index.html',
];

for (const page of htmlPages) {
  check((await readOutput(page)) !== null, `HTML exists: ${page}`);
}

// Every page exports raw markdown beside its HTML.
const markdownPages = [
  'docs.md',
  'docs/guide.md',
  'docs/secret.md',
  'docs/v1.md',
  'docs/v1/guide.md',
  'docs/v0.md',
  'docs/es.md',
  'docs/es/guide.md',
  'docs/es/v1.md',
];

for (const page of markdownPages) {
  check((await readOutput(page)) !== null, `Markdown exists: ${page}`);
}

// The root entry redirects to the default scope (en v2 -> /docs).
const rootEntry = await readOutput('index.html');
check(!!rootEntry?.includes('url=/docs/'), 'root redirects to the default scope');

// Sitemap: only visible pages of visible scopes; no duplicates.
const sitemap = (await readOutput('sitemap.xml')) || '';
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const expectedSitemap = [
  'https://fixture.example.com/docs',
  'https://fixture.example.com/docs/guide',
  'https://fixture.example.com/docs/v1',
  'https://fixture.example.com/docs/v1/guide',
  'https://fixture.example.com/docs/es',
  'https://fixture.example.com/docs/es/guide',
  'https://fixture.example.com/docs/es/v1',
];

check(
  expectedSitemap.every(url => sitemapUrls.includes(url)),
  'sitemap contains every eligible page in every visible scope',
);
check(
  !sitemapUrls.some(url => url.includes('/secret') || url.includes('/v0')),
  'sitemap excludes hidden pages and hidden versions',
);
check(new Set(sitemapUrls).size === sitemapUrls.length, 'sitemap has no duplicate URLs');

// Hidden page and hidden version pages are marked noindex; visible ones are not.
const secretHtml = (await readOutput('docs/secret/index.html')) || '';
const v0Html = (await readOutput('docs/v0/index.html')) || '';
const guideHtml = (await readOutput('docs/guide/index.html')) || '';

check(secretHtml.includes('content="noindex"'), 'hidden page is noindex');
check(v0Html.includes('content="noindex"'), 'hidden version page is noindex');
check(!guideHtml.includes('content="noindex"'), 'visible page is indexable');

// Prerendered documents carry the language of their scope.
const esHtml = (await readOutput('docs/es/index.html')) || '';
check(/<html[^>]*lang="es"/.test(esHtml), 'Spanish page has lang="es"');
check(/<html[^>]*lang="en"/.test(guideHtml), 'English page has lang="en"');

// Redirect rule renders a static redirect page; real pages win over redirects.
const redirectHtml = (await readOutput('docs/old/index.html')) || '';
check(redirectHtml.includes('url=/docs/guide'), 'redirect page targets its destination');

// 404 fallback renders the app shell.
const notFound = (await readOutput('404.html')) || '';
check(notFound.includes('<div id="root">'), '404.html renders');

// Search records carry the scope ids of every visible scope and nothing hidden.
const searchIndex = await fs
  .readFile(path.join(FIXTURE_ROOT, '.shiso/search-index.generated.ts'), 'utf8')
  .catch(() => '');
const scopeIds = new Set([...searchIndex.matchAll(/scopeId: '([^']+)'/g)].map(match => match[1]));

check(
  ['en-v2', 'en-v1', 'es-v2', 'es-v1'].every(id => scopeIds.has(id)),
  'search records cover every visible scope',
);
check(!scopeIds.has('en-v0'), 'search excludes hidden versions');
check(!searchIndex.includes('numbat-secret'), 'search excludes hidden pages');

// No route may produce two HTML files (spot-check: canonical URLs are unique).
const canonicals = [];

for (const page of htmlPages) {
  const html = (await readOutput(page)) || '';
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];

  if (canonical) {
    canonicals.push(canonical);
  }
}

check(new Set(canonicals).size === canonicals.length, 'no duplicate canonical URLs');

if (failures.length) {
  console.error(`\n${failures.length} multi-scope assertion(s) failed.`);
  process.exit(1);
}

console.log('\nMulti-scope fixture build verified.');
