import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from '@/App';
import { getDocModule, getLastModified } from '@/lib/content';
import { buildHead, renderHeadToString } from '@/lib/head';
import { BASE_URL, toAbsoluteUrl } from '@/lib/paths';
import { docsConfig, getRedirects, getSeo, siteName } from '@/lib/site-config';

export interface RenderResult {
  html: string;
  head: string;
}

export interface SitemapEntry {
  url: string;
  lastmod?: string;
}

/** Base-relative routes. The prerenderer prepends the deploy base itself. */
export function getRoutes(): string[] {
  return docsConfig.pages.map(page => page.url);
}

/** Redirect rules with exact-match sources, for static redirect pages. */
export { getRedirects };

/**
 * Absolute URLs for the sitemap, honoring `seo.indexing` and per-page
 * noindex. Empty when `$shiso.siteUrl` is not configured, since a sitemap
 * of relative URLs is invalid.
 */
export function getSitemapEntries(): SitemapEntry[] {
  const { indexing } = getSeo();
  const entries: SitemapEntry[] = [];

  for (const page of docsConfig.pages) {
    if (page.hidden && indexing !== 'all') {
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

  return { html, head: renderHeadToString(buildHead(url)) };
}

export { siteName };
