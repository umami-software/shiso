import type { ShisoOptions } from '@/lib/types';
import rawConfig from '../../docs.json';

/**
 * All URL construction goes through this module.
 *
 * Two separate prefixes are involved and they are easy to confuse:
 * - BASE_URL is Vite's `base` — where the whole site is mounted on the host
 *   (e.g. "/my-docs" when deployed to a subpath). Baked in at build time.
 * - DOCS_PREFIX is where docs pages live *within* the site (default "/docs").
 *   Set "" to serve docs at the site root.
 *
 * Routes stored in the normalized config are base-relative: they include
 * DOCS_PREFIX but not BASE_URL. React Router's `basename` adds BASE_URL, so
 * only code that bypasses the router (prerender output paths, canonical URLs,
 * raw <a href>) needs `toHref`.
 */

const shiso = ((rawConfig as { $shiso?: ShisoOptions }).$shiso || {}) as ShisoOptions;

/** Strips trailing slashes; "/" and "" both normalize to "". */
function normalizePrefix(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '');

  if (!trimmed || trimmed === '/') {
    return '';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export const BASE_URL = normalizePrefix(import.meta.env?.BASE_URL || '/');

export const DOCS_PREFIX = normalizePrefix(shiso.docsPrefix ?? '/docs');

/** Content directory, relative to the project root, without leading/trailing slashes. */
export const CONTENT_DIR = (shiso.contentDir ?? 'content/docs').replace(/^\/+|\/+$/g, '');

/** Absolute origin used for canonical and og:url tags. Undefined when unconfigured. */
export const SITE_URL = shiso.siteUrl?.replace(/\/+$/, '') || undefined;

/** Joins path segments with exactly one slash between them. */
export function joinPath(...parts: (string | undefined)[]): string {
  const joined = parts
    .filter((part): part is string => !!part)
    .join('/')
    .replace(/\/{2,}/g, '/');

  return joined.startsWith('/') ? joined : `/${joined}`;
}

/** Converts a base-relative route to a host-absolute href (prepends BASE_URL). */
export function toHref(routePath: string): string {
  if (isExternalHref(routePath)) {
    return routePath;
  }

  return joinPath(BASE_URL, routePath);
}

/** Converts a base-relative route to a fully qualified URL, when SITE_URL is set. */
export function toAbsoluteUrl(routePath: string): string | undefined {
  return SITE_URL ? `${SITE_URL}${toHref(routePath)}` : undefined;
}

/** Removes BASE_URL from an incoming pathname, yielding a base-relative route. */
export function stripBase(pathname: string): string {
  if (BASE_URL && pathname.startsWith(BASE_URL)) {
    return pathname.slice(BASE_URL.length) || '/';
  }

  return pathname;
}

/** Removes DOCS_PREFIX from a base-relative route, yielding a bare page slug path. */
export function stripDocsPrefix(routePath: string): string {
  if (DOCS_PREFIX && routePath.startsWith(DOCS_PREFIX)) {
    return routePath.slice(DOCS_PREFIX.length);
  }

  return routePath;
}

export function isExternalHref(href: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//');
}
