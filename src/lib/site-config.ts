import rawConfig from 'virtual:shiso-docs-config';
import { resolveDocFile } from '@/lib/content';
import { assertDocsConfig, normalizeDocsConfig } from '@/lib/docs-config';
import { stripBase, stripDocsPrefix } from '@/lib/paths';
import { resolveSiteModel } from '@/lib/site-model';
import type {
  DocsConfig,
  NormalizedDocsConfig,
  NormalizedDocsPage,
  RedirectRule,
  SeoConfig,
} from '@/lib/types';

assertDocsConfig(rawConfig, 'docs.json');

export const siteConfig: DocsConfig = rawConfig;

export const docsConfig: NormalizedDocsConfig = normalizeDocsConfig(siteConfig, resolveDocFile);

export const siteModel = resolveSiteModel(siteConfig, docsConfig);

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

export function getPageTitle(pageTitle?: string): string {
  if (pageTitle && siteName) {
    return `${pageTitle} – ${siteName}`;
  }

  return pageTitle || siteName || '';
}
