/**
 * Prerenders every docs page to static HTML.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server):
 * 1. Loads the SSR bundle from dist/server.
 * 2. Renders each route from the normalized docs.json navigation.
 * 3. Injects the rendered HTML and per-page head tags into the client
 *    dist/client/index.html template.
 * 4. Writes dist/client/<base>/<route>/index.html plus a root entry and 404 page.
 *
 * Routes from the SSR bundle are base-relative; the deploy base is applied here
 * so the output directory layout matches the URLs the router will produce.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { operationToMarkdown, schemaToMarkdown } from './lib/openapi.mjs';
import { loadApiProject, lookupOperation, lookupSchema } from './lib/openapi-project.mjs';
import { loadDocsConfig } from './load-docs-config.mjs';

const DEFAULT_HEAD_OPEN = '<!--shiso-default-head-->';
const DEFAULT_HEAD_CLOSE = '<!--/shiso-default-head-->';

const root = process.cwd();
const clientDir = path.join(root, 'dist', 'client');
const template = await readFile(path.join(clientDir, 'index.html'), 'utf8');

if (!template.includes('<!--app-html-->')) {
  throw new Error(
    'dist/client/index.html is missing the <!--app-html--> placeholder. ' +
      'Run "vite build" again before prerendering (prerender consumes the template in place).',
  );
}

const {
  render,
  getRoutes,
  getRedirects,
  getSitemapEntries,
  getMarkdownPages,
  getLlmsPages,
  docsHomeUrl,
  siteName,
  siteDescription,
} = await import(pathToFileURL(path.join(root, 'dist', 'server', 'entry-server.js')).href);

/** Vite's `base`, normalized to "" or "/prefix". */
function readBase() {
  const match = template.match(/<script[^>]+src="([^"]*)\/assets\//);
  const base = match?.[1] ?? '';
  return base === '/' ? '' : base;
}

const base = readBase();

function withBase(routePath) {
  return `${base}${routePath}`.replace(/\/{2,}/g, '/') || '/';
}

function fillTemplate(head, html, htmlAttrs) {
  // Per-page head tags supersede the site-level defaults injected at build time.
  let output = head
    ? template.replace(new RegExp(`${DEFAULT_HEAD_OPEN}[\\s\\S]*?${DEFAULT_HEAD_CLOSE}`), '')
    : template;

  // Per-page document language and direction, replacing the template's own.
  if (htmlAttrs) {
    output = output.replace(/<html([^>]*)>/, (_match, attrs) => {
      const kept = attrs.replace(/\s+lang="[^"]*"/, '').replace(/\s+dir="[^"]*"/, '');
      const dir = htmlAttrs.dir === 'rtl' ? ' dir="rtl"' : '';
      return `<html${kept} lang="${htmlAttrs.lang}"${dir}>`;
    });
  }

  return output.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
}

async function writePage(outputPath, contents) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, contents, 'utf8');
}

/** Maps a base-relative route to its output file, e.g. "/docs/a" -> "docs/a/index.html". */
function outputPathFor(routePath) {
  const relative = withBase(routePath).replace(/^\//, '');
  return path.join(clientDir, relative, 'index.html');
}

const routes = getRoutes();

for (const route of routes) {
  const { html, head, htmlAttrs } = render(route);
  await writePage(outputPathFor(route), fillTemplate(head, html, htmlAttrs));
}

// Root entry. When the default scope's landing page is not the root itself the
// root is a redirect; a meta refresh alone is slow and SEO-hostile, so pair it
// with a canonical link and an immediate history-replacing navigation.
// When a standalone page owns "/", the routes loop above already rendered the
// real home page into dist/client/index.html — do not overwrite it.
if (docsHomeUrl && docsHomeUrl !== '/' && !routes.includes('/')) {
  const target = withBase(`${docsHomeUrl}/`);

  await writePage(
    path.join(clientDir, 'index.html'),
    fillTemplate(
      [
        `<link rel="canonical" href="${target}" />`,
        `<meta http-equiv="refresh" content="0;url=${target}" />`,
        `<script>location.replace(${JSON.stringify(target)});</script>`,
      ].join('\n    '),
      '',
    ),
  );
}

// Pages bound to an API operation publish the generated reference as markdown
// too, so the .md copies and llms-full.txt stay useful to AI tools.
let apiProject;
{
  const docsConfig = (await loadDocsConfig({ root, expandGlobs: false })).config;
  if (docsConfig.api?.spec) {
    apiProject = await loadApiProject({ root, api: docsConfig.api });
  }
}

function frontmatterValue(source, name) {
  const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] || '';
  return frontmatter
    .match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]
    ?.trim()
    .replace(/^["']|["']$/g, '');
}

function withOperationMarkdown(source) {
  if (!apiProject) return source;
  const operation = lookupOperation(apiProject, frontmatterValue(source, 'openapi'));
  if (operation) return `${source.trimEnd()}\n\n${operationToMarkdown(operation)}\n`;
  const schema = lookupSchema(apiProject, frontmatterValue(source, 'openapi-schema'));
  return schema ? `${source.trimEnd()}\n\n${schemaToMarkdown(schema)}\n` : source;
}

// Raw markdown next to every page: "/docs/installation" -> "docs/installation.md".
// Served for the contextual menu's copy/view options and for AI tools.
const markdownPages = getMarkdownPages();

for (const { route, filePath } of markdownPages) {
  const source = await readFile(path.join(root, ...filePath.split('/').filter(Boolean)), 'utf8');
  const relative = withBase(route).replace(/^\//, '') || 'index';
  await writePage(path.join(clientDir, `${relative}.md`), withOperationMarkdown(source));
}

// AI discovery files. llms.txt is the concise, ordered map; llms-full.txt is
// the same public corpus concatenated for tools that prefer one fetch.
const llmsPages = getLlmsPages();

function markdownHref(route) {
  const relative = withBase(route).replace(/^\//, '') || 'index';
  return `/${relative}.md`;
}

const llmsHeader = [
  `# ${siteName || 'Documentation'}`,
  siteDescription ? `> ${siteDescription}` : null,
]
  .filter(Boolean)
  .join('\n\n');
const llmsLinks = llmsPages
  .map(
    page =>
      `- [${page.title}](${markdownHref(page.route)})${page.description ? `: ${page.description}` : ''}`,
  )
  .join('\n');

await writePage(
  path.join(clientDir, 'llms.txt'),
  `${llmsHeader}\n\n## Documentation\n\n${llmsLinks}\n`,
);

const llmsFullSections = [];
for (const page of llmsPages) {
  const source = await readFile(
    path.join(root, ...page.filePath.split('/').filter(Boolean)),
    'utf8',
  );
  llmsFullSections.push(
    [`# ${page.title}`, `Source: ${markdownHref(page.route)}`, source.trim()].join('\n\n'),
  );
}

await writePage(
  path.join(clientDir, 'llms-full.txt'),
  `${llmsHeader}\n\n${llmsFullSections.join('\n\n---\n\n')}\n`,
);

// Redirect pages. Static hosting cannot serve real 301s, so each redirect
// gets the same canonical + meta refresh + immediate replace treatment as
// the root entry. Real pages always win over redirect rules.
const routeSet = new Set(routes.map(withBase));
const redirects = getRedirects();

function redirectTarget(destination) {
  return /^[a-z][a-z0-9+.-]*:/i.test(destination) ? destination : withBase(destination);
}

for (const { source, destination } of redirects) {
  if (routeSet.has(withBase(source))) {
    console.warn(`Redirect source "${source}" is an existing page — skipped.`);
    continue;
  }

  const target = redirectTarget(destination);

  await writePage(
    outputPathFor(source),
    fillTemplate(
      [
        `<link rel="canonical" href="${target}" />`,
        `<meta name="robots" content="noindex" />`,
        `<meta http-equiv="refresh" content="0;url=${target}" />`,
        `<script>location.replace(${JSON.stringify(target)});</script>`,
      ].join('\n    '),
      '',
    ),
  );
}

// Sitemap, only when shiso.config siteUrl provides an absolute origin.
const sitemapEntries = getSitemapEntries();

if (sitemapEntries.length) {
  const urls = sitemapEntries
    .map(({ url, lastmod }) =>
      [
        '  <url>',
        `    <loc>${url}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n');

  await writePage(
    path.join(clientDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
}

// 404 fallback renders the app shell so client routing can take over
// on hosts that serve 404.html for unknown paths (e.g. GitHub Pages).
const notFound = render('/404');
await writePage(
  path.join(clientDir, '404.html'),
  fillTemplate(notFound.head, notFound.html, notFound.htmlAttrs),
);

// Guard against a base/route mismatch silently producing unreachable files.
const stray = routes.filter(route => !withBase(route).startsWith(base || '/'));

if (stray.length) {
  throw new Error(`Routes fall outside the deploy base "${base}": ${stray.join(', ')}`);
}

const extras = [
  redirects.length ? `${redirects.length} redirects` : null,
  sitemapEntries.length ? 'sitemap.xml' : null,
  'llms.txt',
  'llms-full.txt',
]
  .filter(Boolean)
  .join(', ');

console.log(
  `Prerendered ${routes.length} pages to ${path.relative(root, clientDir)}${extras ? ` (+ ${extras})` : ''}`,
);
