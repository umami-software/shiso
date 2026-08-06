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

const docsJson = JSON.parse(await readFile(path.join(root, 'docs.json'), 'utf8'));
const docsPrefix = (docsJson.$shiso?.docsPrefix ?? '/docs').replace(/\/+$/, '');

const { render, getRoutes } = await import(
  new URL(path.join(root, 'dist', 'server', 'entry-server.js'), 'file://').href
);

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

function fillTemplate(head, html) {
  // Per-page head tags supersede the site-level defaults injected at build time.
  const output = head
    ? template.replace(new RegExp(`${DEFAULT_HEAD_OPEN}[\\s\\S]*?${DEFAULT_HEAD_CLOSE}`), '')
    : template;

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
  const { html, head } = render(route);
  await writePage(outputPathFor(route), fillTemplate(head, html));
}

// Root entry. When docs live at a prefix the root is a redirect; a meta refresh
// alone is slow and SEO-hostile, so pair it with a canonical link and an
// immediate history-replacing navigation.
if (docsPrefix) {
  const target = withBase(`${docsPrefix}/`);

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

// 404 fallback renders the app shell so client routing can take over
// on hosts that serve 404.html for unknown paths (e.g. GitHub Pages).
const notFound = render('/404');
await writePage(path.join(clientDir, '404.html'), fillTemplate(notFound.head, notFound.html));

// Guard against a base/route mismatch silently producing unreachable files.
const stray = routes.filter(route => !withBase(route).startsWith(base || '/'));

if (stray.length) {
  throw new Error(`Routes fall outside the deploy base "${base}": ${stray.join(', ')}`);
}

console.log(`Prerendered ${routes.length} pages to ${path.relative(root, clientDir)}`);
