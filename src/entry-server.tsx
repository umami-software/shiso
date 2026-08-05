import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from '@/App';
import { getDocModule } from '@/lib/content';
import { docsConfig, getPageTitle, siteConfig, siteName } from '@/lib/site-config';

export interface RenderResult {
  html: string;
  head: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function getRoutes(): string[] {
  return docsConfig.pages.map(page => page.url);
}

export function render(url: string): RenderResult {
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );

  const page = docsConfig.pages.find(item => item.url === url);
  const doc = page ? getDocModule(page.filePath) : undefined;
  const title = getPageTitle(doc?.frontmatter?.title || page?.label);
  const description = doc?.frontmatter?.description || siteConfig.description;

  const head = [
    `<title>${escapeHtml(title)}</title>`,
    description ? `<meta name="description" content="${escapeHtml(description)}" />` : '',
  ]
    .filter(Boolean)
    .join('\n    ');

  return { html, head };
}

export { siteName };
