import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from '@/App';
import { buildHead, renderHeadToString } from '@/lib/head';
import { BASE_URL } from '@/lib/paths';
import { docsConfig, siteName } from '@/lib/site-config';

export interface RenderResult {
  html: string;
  head: string;
}

/** Base-relative routes. The prerenderer prepends the deploy base itself. */
export function getRoutes(): string[] {
  return docsConfig.pages.map(page => page.url);
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
