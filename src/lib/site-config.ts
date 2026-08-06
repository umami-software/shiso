import { resolveDocFile } from '@/lib/content';
import { assertDocsConfig, normalizeDocsConfig } from '@/lib/docs-config';
import { stripBase, stripDocsPrefix } from '@/lib/paths';
import type { DocsConfig, NormalizedDocsConfig, NormalizedDocsPage } from '@/lib/types';
import rawConfig from '../../docs.json';

assertDocsConfig(rawConfig, 'docs.json');

export const siteConfig: DocsConfig = rawConfig;

export const docsConfig: NormalizedDocsConfig = normalizeDocsConfig(siteConfig, resolveDocFile);

export const siteName = siteConfig.name || 'Shiso';

export interface LogoConfig {
  light?: string;
  dark?: string;
  href?: string;
}

export function getLogo(): LogoConfig | null {
  const { logo } = siteConfig;

  if (!logo) {
    return null;
  }

  if (typeof logo === 'string') {
    return { light: logo, dark: logo };
  }

  return { light: logo.light || logo.dark, dark: logo.dark || logo.light, href: logo.href };
}

export function normalizeParamSlug(slug: string): string {
  const cleaned = slug.replace(/^\/+|\/+$/g, '');

  if (!cleaned) {
    return 'index';
  }

  if (cleaned === 'index') {
    return cleaned;
  }

  return cleaned.replace(/\/index$/, '') || 'index';
}

export function getPageByPathname(pathname: string): NormalizedDocsPage | null {
  const slug = normalizeParamSlug(stripDocsPrefix(stripBase(pathname)));
  return docsConfig.pageByLookupSlug[slug] || null;
}

export interface PageNavLink {
  label: string;
  url: string;
}

/** Hidden pages are routable but stay out of the pager. */
const pagerPages = docsConfig.pages.filter(page => !page.hidden);

export function getPrevNext(slug: string): {
  prev: PageNavLink | null;
  next: PageNavLink | null;
} {
  const pages = pagerPages;
  const index = pages.findIndex(page => page.slug === slug);
  const prev = index > 0 ? pages[index - 1] : null;
  const next = index >= 0 && index < pages.length - 1 ? pages[index + 1] : null;

  return {
    prev: prev ? { label: prev.label, url: prev.url } : null,
    next: next ? { label: next.label, url: next.url } : null,
  };
}

export function getPageTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} – ${siteName}` : siteName;
}
