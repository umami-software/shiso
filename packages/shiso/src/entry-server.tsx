import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from '@/App';
import { getDocModule, getLastModified } from '@/lib/content';
import { getScopeForPage } from '@/lib/docs-config';
import { buildHead, renderHeadToString } from '@/lib/head';
import { BASE_URL, toAbsoluteUrl } from '@/lib/paths';
import {
  docsHomeUrl,
  docsSite,
  getLocaleByPathname,
  getRedirects,
  getSeo,
  siteName,
  standalonePages,
} from '@/lib/site-config';

export interface RenderResult {
  html: string;
  head: string;
  /** Attributes for the document element: language and text direction. */
  htmlAttrs: { lang: string; dir: 'ltr' | 'rtl' };
}

export interface SitemapEntry {
  url: string;
  lastmod?: string;
}

/** Base-relative routes for every scope. The prerenderer prepends the deploy base itself. */
export function getRoutes(): string[] {
  return [...docsSite.pages.map(page => page.url), ...standalonePages.map(page => page.path)];
}

/** Redirect rules with exact-match sources, for static redirect pages. */
export { getRedirects };

/**
 * Source file for every routed page, so the prerenderer can publish raw
 * markdown next to each HTML page (used by the contextual menu's copy/view
 * options and by AI tools). `filePath` is a module key like
 * "/content/docs/index.mdx", resolved against the project root.
 */
export function getMarkdownPages(): { route: string; filePath: string }[] {
  return [
    ...docsSite.pages.map(page => ({ route: page.url, filePath: page.filePath })),
    ...standalonePages.map(page => ({ route: page.path, filePath: page.filePath })),
  ];
}

/**
 * Absolute URLs for the sitemap, honoring `seo.indexing` and per-page
 * noindex. Empty when the shiso.config `siteUrl` is not configured, since a sitemap
 * of relative URLs is invalid.
 */
export function getSitemapEntries(): SitemapEntry[] {
  const { indexing } = getSeo();
  const entries: SitemapEntry[] = [];

  for (const page of docsSite.pages) {
    // Hidden pages and pages of hidden scopes (versions/languages) stay out
    // of the sitemap unless `seo.indexing: "all"` opts them in.
    if ((page.hidden || getScopeForPage(docsSite, page).hidden) && indexing !== 'all') {
      continue;
    }

    if (getDocModule(page.filePath)?.frontmatter?.noindex === true) {
      continue;
    }

    const url = toAbsoluteUrl(page.url);

    if (url) {
      entries.push({ url, lastmod: getLastModified(page.filePath) });
    }
  }

  // Standalone pages are always navigable; only frontmatter noindex opts out.
  for (const page of standalonePages) {
    if (getDocModule(page.filePath)?.frontmatter?.noindex === true) {
      continue;
    }

    const url = toAbsoluteUrl(page.path);

    if (url) {
      entries.push({ url, lastmod: getLastModified(page.filePath) });
    }
  }

  return entries;
}

export function render(url: string): RenderResult {
  // basename must match the client's BrowserRouter, or every <Link> in the
  // prerendered HTML would omit the deploy base and mismatch on hydration.
  const html = renderToString(
    <StaticRouter basename={BASE_URL || undefined} location={`${BASE_URL}${url}`}>
      <App />
    </StaticRouter>,
  );

  return { html, head: renderHeadToString(buildHead(url)), htmlAttrs: getLocaleByPathname(url) };
}

export { docsHomeUrl, siteName };
