import type { DocsConfig, NormalizedDocsSite, StandalonePage } from '@/lib/types';

/**
 * Standalone pages: routes outside the docs navigation, declared with the
 * top-level `pages` key in docs.json. They render with the site chrome
 * (banner, header, footer) but no sidebar or table of contents, and a
 * `path: "/"` entry replaces the default root redirect to the docs home.
 */

export interface NormalizeStandaloneOptions {
  /** Docs prefix ("" or "/prefix"); standalone paths may not live under it. */
  docsPrefix?: string;
}

function invalid(message: string): Error {
  return new Error(`Invalid docs config: ${message}`);
}

/** Trims and canonicalizes a standalone route path; throws when malformed. */
function normalizePath(rawPath: unknown): string {
  const value = typeof rawPath === 'string' ? rawPath.trim() : '';

  if (!value.startsWith('/')) {
    throw invalid(`standalone page path "${String(rawPath)}" must start with "/".`);
  }

  if (/[:*]/.test(value)) {
    throw invalid(`standalone page path "${value}" must not use wildcard patterns.`);
  }

  if (/\.mdx?$/i.test(value)) {
    throw invalid(
      `standalone page path "${value}" must be a route, not a file — drop the extension.`,
    );
  }

  const collapsed = value.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  return collapsed || '/';
}

/** Mirrors normalizePageReference in docs-config.ts for the `page` slug. */
function normalizePageSlug(rawSlug: unknown): string {
  const value = typeof rawSlug === 'string' ? rawSlug : '';

  return (
    value
      .trim()
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/^pages\//, '')
      .replace(/\.mdx?$/, '')
      .replace(/\/+$/, '') || 'index'
  );
}

export function normalizeStandalonePages(
  config: DocsConfig,
  resolvePageFile: (fileSlug: string) => string | undefined,
  site: NormalizedDocsSite,
  options: NormalizeStandaloneOptions = {},
): StandalonePage[] {
  const items = config.pages || [];

  if (!items.length) {
    return [];
  }

  const docsPrefix = options.docsPrefix || '';
  const pages: StandalonePage[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const path = normalizePath(item?.path);

    if (seen.has(path)) {
      throw invalid(`duplicate standalone page path "${path}".`);
    }

    seen.add(path);

    if (path === '/404') {
      throw invalid('standalone page path "/404" is reserved for the error page.');
    }

    const docsPage = site.pageByUrl[path];

    if (docsPage) {
      throw invalid(
        `standalone page path "${path}" collides with the docs page "${docsPage.fileSlug}". ` +
          'Standalone pages must live outside the docs navigation.',
      );
    }

    if (docsPrefix && (path === docsPrefix || path.startsWith(`${docsPrefix}/`))) {
      throw invalid(
        `standalone page path "${path}" is inside the docs prefix "${docsPrefix}". ` +
          'Standalone pages must live outside the docs tree.',
      );
    }

    const fileSlug = normalizePageSlug(item?.page);
    const filePath = resolvePageFile(fileSlug);

    if (!filePath) {
      throw new Error(
        `Missing standalone page file for "${fileSlug}": expected ` +
          `"content/pages/${fileSlug}.mdx" or ".md".`,
      );
    }

    pages.push({ path, filePath, title: item?.title?.trim() || undefined });
  }

  return pages;
}

/**
 * Exact standalone page lookup by base-relative pathname. Tolerates trailing
 * slashes and an explicit `/index` suffix, like getPageByPathname.
 */
export function getStandalonePageByPathname(
  pages: StandalonePage[],
  pathname: string,
): StandalonePage | null {
  const trimmed = pathname.replace(/\/+$/, '') || '/';
  const collapsed = trimmed === '/index' ? '/' : trimmed.replace(/\/index$/, '') || '/';

  return pages.find(page => page.path === trimmed || page.path === collapsed) || null;
}
