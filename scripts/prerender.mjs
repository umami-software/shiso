/**
 * Prerenders every docs page to static HTML.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server):
 * 1. Loads the SSR bundle from dist/server.
 * 2. Renders each route from the normalized docs.json navigation.
 * 3. Injects the rendered HTML and per-page head tags into the client
 *    dist/client/index.html template.
 * 4. Writes dist/client/<route>/index.html plus a root redirect and 404 page.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const clientDir = path.join(root, 'dist', 'client');
const template = await readFile(path.join(clientDir, 'index.html'), 'utf8');

if (!template.includes('<!--app-html-->')) {
  throw new Error(
    'dist/client/index.html is missing the <!--app-html--> placeholder. ' +
      'Run "vite build" again before prerendering (prerender consumes the template in place).',
  );
}

const { render, getRoutes } = await import(
  new URL(path.join(root, 'dist', 'server', 'entry-server.js'), 'file://').href
);

function fillTemplate(head, html) {
  let output = template;

  // Drop the site-level default <title> when the page provides its own.
  if (head.includes('<title>')) {
    output = output.replace(/<title>[^<]*<\/title>/, '');
  }

  return output.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
}

async function writePage(outputPath, contents) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, contents, 'utf8');
}

const routes = getRoutes();

for (const route of routes) {
  const { html, head } = render(route);
  const outputPath = path.join(clientDir, route.replace(/^\//, ''), 'index.html');
  await writePage(outputPath, fillTemplate(head, html));
}

// Root redirect to /docs.
await writePage(
  path.join(clientDir, 'index.html'),
  fillTemplate('<meta http-equiv="refresh" content="0;url=/docs/" />', ''),
);

// 404 fallback renders the app shell so client routing can take over
// on hosts that serve 404.html for unknown paths (e.g. GitHub Pages).
const notFound = render('/404');
await writePage(path.join(clientDir, '404.html'), fillTemplate(notFound.head, notFound.html));

console.log(`Prerendered ${routes.length} pages to ${path.relative(root, clientDir)}`);
