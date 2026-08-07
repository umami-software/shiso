import { useEffect, useRef } from 'react';
import { getDocModule, getLastModified } from '@/lib/content';
import { SITE_URL, toAbsoluteUrl } from '@/lib/paths';
import {
  getPageByPathname,
  getPageTitle,
  getSeo,
  showTimestamp,
  siteConfig,
  siteName,
} from '@/lib/site-config';

/**
 * The document head is a pure function of the route.
 *
 * Every input — docs.json and the eagerly-globbed frontmatter — is available
 * synchronously on both the server and the client, so there is no need for a
 * head manager, a context provider, or a data router. `renderHeadToString` and
 * `applyHead` consume the exact same `buildHead` output, which makes the
 * prerendered markup and post-navigation DOM identical by construction.
 */

export interface HeadTag {
  tag: 'title' | 'meta' | 'link' | 'script';
  attrs?: Record<string, string>;
  children?: string;
}

/** Marks tags this module owns, so client navigation can replace exactly its own. */
export const HEAD_MARKER = 'data-shiso-head';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** JSON-LD is script content, not attribute content: only `<` and `&` need care. */
function escapeJsonLd(value: string): string {
  return value.replace(/</g, '\\u003c');
}

export function buildHead(pathname: string): HeadTag[] {
  const page = getPageByPathname(pathname);
  const doc = page ? getDocModule(page.filePath) : undefined;
  const frontmatter = doc?.frontmatter;

  const seo = getSeo();
  const pageTitle = frontmatter?.title || page?.label;
  const title = getPageTitle(pageTitle);
  const description = frontmatter?.description || siteConfig.description;
  const canonical = page ? toAbsoluteUrl(page.url) : undefined;
  // `seo.indexing: "all"` opts hidden pages into the index; explicit
  // per-page `noindex` frontmatter always wins.
  const noindex =
    !page || frontmatter?.noindex === true || (!!page.hidden && seo.indexing !== 'all');

  const tags: HeadTag[] = [{ tag: 'title', children: title }];

  if (description) {
    tags.push({ tag: 'meta', attrs: { name: 'description', content: description } });
  }

  if (canonical) {
    tags.push({ tag: 'link', attrs: { rel: 'canonical', href: canonical } });
  }

  if (noindex) {
    tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } });
  }

  // Open Graph
  tags.push(
    { tag: 'meta', attrs: { property: 'og:type', content: 'article' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: siteName } },
    { tag: 'meta', attrs: { property: 'og:title', content: title } },
  );

  if (description) {
    tags.push({ tag: 'meta', attrs: { property: 'og:description', content: description } });
  }

  if (canonical) {
    tags.push({ tag: 'meta', attrs: { property: 'og:url', content: canonical } });
  }

  // Twitter
  tags.push(
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: title } },
  );

  if (description) {
    tags.push({ tag: 'meta', attrs: { name: 'twitter:description', content: description } });
  }

  // Last-modified time, when the timestamp feature is on for this page.
  const lastModified =
    page && showTimestamp(frontmatter?.timestamp) ? getLastModified(page.filePath) : undefined;

  if (lastModified) {
    tags.push({ tag: 'meta', attrs: { property: 'article:modified_time', content: lastModified } });
  }

  // Site-wide meta tags from `seo.metatags`. Emitted last so authors can see
  // them win over the generated defaults in devtools; `og:*`-style keys are
  // property attributes, the rest are name attributes.
  for (const [key, content] of Object.entries(seo.metatags || {})) {
    if (key === 'title' || typeof content !== 'string') {
      continue;
    }

    const attribute = /^(og|article|fb|profile|book|music|video):/.test(key) ? 'property' : 'name';
    tags.push({ tag: 'meta', attrs: { [attribute]: key, content } });
  }

  // Structured data. Only emitted with an absolute origin, since both
  // TechArticle.url and BreadcrumbList items require resolvable URLs.
  if (page && canonical && SITE_URL) {
    const breadcrumbs = [
      { name: siteName, url: toAbsoluteUrl('/') },
      page.section !== page.tabLabel ? { name: page.tabLabel } : null,
      { name: page.section },
      { name: page.label, url: canonical },
    ].filter((item): item is { name: string; url?: string } => !!item);

    tags.push({
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      children: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: pageTitle || page.label,
          description,
          url: canonical,
          isPartOf: { '@type': 'WebSite', name: siteName, url: SITE_URL },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            ...(item.url ? { item: item.url } : {}),
          })),
        },
      ]),
    });
  }

  return tags;
}

export function renderHeadToString(tags: HeadTag[]): string {
  return tags
    .map(({ tag, attrs, children }) => {
      const attributes = Object.entries(attrs || {})
        .map(([key, value]) => ` ${key}="${escapeHtml(value)}"`)
        .join('');

      if (tag === 'meta' || tag === 'link') {
        return `<${tag}${attributes} ${HEAD_MARKER} />`;
      }

      const content = tag === 'script' ? escapeJsonLd(children || '') : escapeHtml(children || '');

      return `<${tag}${attributes} ${HEAD_MARKER}>${content}</${tag}>`;
    })
    .join('\n    ');
}

export function applyHead(tags: HeadTag[]) {
  const { head } = document;

  head.querySelectorAll(`[${HEAD_MARKER}]`).forEach(node => {
    node.remove();
  });

  for (const { tag, attrs, children } of tags) {
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(attrs || {})) {
      element.setAttribute(key, value);
    }

    if (children !== undefined) {
      element.textContent = children;
    }

    element.setAttribute(HEAD_MARKER, '');
    head.append(element);
  }
}

/**
 * Applies the head for the current route on client navigation.
 *
 * The first render after hydration is skipped: the prerendered head is already
 * correct, and rewriting it would tear down and recreate every tag on load.
 */
export function useHead(pathname: string) {
  const hydratedPath = useRef<string | null>(null);

  useEffect(() => {
    if (hydratedPath.current === null) {
      hydratedPath.current = pathname;
      return;
    }

    applyHead(buildHead(pathname));
  }, [pathname]);
}
