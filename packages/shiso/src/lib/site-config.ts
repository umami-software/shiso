import rawConfig from 'virtual:shiso-docs-config';
import { resolveDocFile } from '@/lib/content';
import {
  assertDocsConfig,
  getDefaultScope,
  getScopeForPage,
  getPageByPathname as getSitePageByPathname,
  normalizeDocsSite,
} from '@/lib/docs-config';
import { getTextDirection, resolveLocale } from '@/lib/locale';
import { stripBase } from '@/lib/paths';
import { resolveSiteModel } from '@/lib/site-model';
import type {
  DocsConfig,
  DocsScope,
  NormalizedDocsConfig,
  NormalizedDocsPage,
  NormalizedDocsSite,
  RedirectRule,
  SeoConfig,
} from '@/lib/types';

assertDocsConfig(rawConfig, 'docs.json');

export const siteConfig: DocsConfig = rawConfig;

/** The complete normalized site: every version/language scope. */
export const docsSite: NormalizedDocsSite = normalizeDocsSite(siteConfig, resolveDocFile);

/** The default scope's navigation, used where a single navigation is expected. */
export const docsConfig: NormalizedDocsConfig = getDefaultScope(docsSite).docs;

/** Landing page of the default scope: the site-wide "docs home" URL. */
export const docsHomeUrl = getDefaultScope(docsSite).firstPageUrl;

export const siteModel = resolveSiteModel(siteConfig, docsConfig);

/** Scope that owns the current pathname; the default scope for unknown paths. */
export function getScopeByPathname(pathname: string): DocsScope {
  const page = getPageByPathname(pathname);
  return page ? getScopeForPage(docsSite, page) : getDefaultScope(docsSite);
}

/** Document language and direction for a pathname, from its scope's language. */
export function getLocaleByPathname(pathname: string): { lang: string; dir: 'ltr' | 'rtl' } {
  const lang = resolveLocale(getScopeByPathname(pathname).language, siteModel.locale);
  return { lang, dir: getTextDirection(lang) };
}

export const siteName = siteModel.name;

/** Trailing-slash-insensitive route key for redirect matching. */
function toRouteKey(routePath: string): string {
  const trimmed = routePath.replace(/\/+$/, '');
  return trimmed || '/';
}

/**
 * Redirect rules with exact-match sources. Wildcard patterns are part of the
 * standard but not implemented; they are skipped with a warning.
 */
export function getRedirects(): RedirectRule[] {
  return (siteConfig.redirects || []).filter(rule => {
    if (!rule?.source || !rule.destination) {
      return false;
    }

    if (/[:*]/.test(rule.source)) {
      console.warn(
        `[shiso] Redirect source "${rule.source}" uses a wildcard pattern, which is not ` +
          'implemented yet — it will be skipped.',
      );
      return false;
    }

    return true;
  });
}

const redirectBySource = new Map(
  getRedirects().map(rule => [toRouteKey(rule.source), rule.destination]),
);

/** Destination for a base-relative route covered by a redirect rule, if any. */
export function matchRedirect(routePath: string): string | null {
  return redirectBySource.get(toRouteKey(routePath)) || null;
}

export function getSeo(): SeoConfig {
  const seo = siteConfig.seo || {};

  return {
    metatags: seo.metatags || {},
    indexing: seo.indexing === 'all' ? 'all' : 'navigable',
  };
}

/** True when the last-modified timestamp should show for a page. */
export function showTimestamp(frontmatterValue: unknown): boolean {
  if (typeof frontmatterValue === 'boolean') {
    return frontmatterValue;
  }

  return siteModel.showTimestamp;
}

export function getPageByPathname(pathname: string): NormalizedDocsPage | null {
  return getSitePageByPathname(docsSite, stripBase(pathname));
}

export function getPageTitle(pageTitle?: string): string {
  if (pageTitle && siteName) {
    return `${pageTitle} – ${siteName}`;
  }

  return pageTitle || siteName || '';
}
