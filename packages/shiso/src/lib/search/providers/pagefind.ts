import type { SearchContext, SearchResult } from '@/lib/search';
import type { SearchProvider } from '@/lib/search/provider';

/** Subset of the Pagefind browser API used by this provider. The types are
 * declared locally because the `pagefind` package is an optional dependency
 * and its browser bundle only exists in built output. */
interface PagefindSubResult {
  title?: string;
  url: string;
  excerpt?: string;
}

export interface PagefindFragment {
  url: string;
  excerpt?: string;
  meta?: { title?: string };
  sub_results?: PagefindSubResult[];
}

export interface PagefindResult {
  id: string;
  score?: number;
  data(): Promise<PagefindFragment>;
}

interface PagefindApi {
  options(options: Record<string, unknown>): Promise<void>;
  init(): Promise<void>;
  search(query: string, options?: Record<string, unknown>): Promise<{ results: PagefindResult[] }>;
}

type Backend = { kind: 'pagefind'; api: PagefindApi } | { kind: 'local'; provider: SearchProvider };

const DEFAULT_LIMIT = 10;

/**
 * Sanitizes a Pagefind excerpt: keeps the `<mark>` highlight tags (rendered
 * as highlights by the search dialog, never as raw HTML), strips every other
 * tag, and decodes basic HTML entities.
 */
export function sanitizePagefindExcerpt(excerpt: string): string {
  return excerpt
    .replace(/<(?!\/?mark>)[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
}

/** Converts a Pagefind result URL into a router-relative path: strips a
 * trailing `/index.html` and trailing slash while preserving `#anchor`. */
export function normalizePagefindUrl(url: string): string {
  const hashIndex = url.indexOf('#');
  const hash = hashIndex === -1 ? '' : url.slice(hashIndex);
  let pathname = hashIndex === -1 ? url : url.slice(0, hashIndex);

  pathname = pathname.replace(/\/index\.html$/, '/');

  if (pathname.length > 1) {
    pathname = pathname.replace(/\/+$/, '') || '/';
  }

  return `${pathname}${hash}`;
}

/** Maps loaded Pagefind fragments to `SearchResult`s. Each sub-result (a
 * heading-bounded section) becomes its own result; duplicate URLs are
 * dropped because the search dialog keys items by URL. */
export function mapPagefindResults(
  fragments: { fragment: PagefindFragment; score?: number }[],
  limit: number,
): SearchResult[] {
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  for (const { fragment, score } of fragments) {
    const page = fragment.meta?.title || fragment.url;
    const subResults = fragment.sub_results?.length
      ? fragment.sub_results
      : [{ url: fragment.url, excerpt: fragment.excerpt }];

    for (const subResult of subResults) {
      const url = normalizePagefindUrl(subResult.url);

      if (seen.has(url)) {
        continue;
      }

      seen.add(url);

      const hasAnchor = url.includes('#');
      const heading =
        hasAnchor && subResult.title && subResult.title !== page ? subResult.title : undefined;
      const excerpt = subResult.excerpt || fragment.excerpt;

      results.push({
        url,
        page,
        heading,
        snippet: excerpt ? sanitizePagefindExcerpt(excerpt) : undefined,
        score: score ?? 0,
      });

      if (results.length >= limit) {
        return results;
      }
    }
  }

  return results;
}

/**
 * Built-in provider backed by a Pagefind index generated during `shiso build`.
 * When the Pagefind bundle is unavailable (for example in dev, where no
 * prerendered HTML exists), it falls back to the local provider.
 */
export function createPagefindSearchProvider(
  options: Record<string, unknown> = {},
): SearchProvider {
  let backend: Promise<Backend> | null = null;

  async function loadBackend(): Promise<Backend> {
    // Mirrors the BASE_URL normalization in `@/lib/paths` without importing
    // it — that module depends on `virtual:shiso-docs-config`, which is not
    // available to the standalone `@umami/shiso/search` bundle.
    const base = (import.meta.env?.BASE_URL || '/').trim().replace(/\/+$/, '');

    try {
      const api: PagefindApi = await import(/* @vite-ignore */ `${base}/pagefind/pagefind.js`);
      const ranking = options.ranking;

      await api.options({
        baseUrl: '/',
        ...(ranking && typeof ranking === 'object' ? { ranking } : {}),
      });
      await api.init();

      return { kind: 'pagefind', api };
    } catch (error) {
      console.warn(
        '[shiso] Pagefind bundle not found — falling back to local search. ' +
          'This is expected in dev; run "shiso build" to generate the Pagefind index.',
        error,
      );

      const { createLocalSearchProvider } = await import('@/lib/search/providers/local');

      return { kind: 'local', provider: createLocalSearchProvider({}) };
    }
  }

  return {
    async search(query: string, limit = DEFAULT_LIMIT, context?: SearchContext) {
      backend ||= loadBackend();
      const resolved = await backend;

      if (resolved.kind === 'local') {
        return resolved.provider.search(query, limit, context);
      }

      const filters =
        context?.scopeId && context.scopeId !== 'default'
          ? { filters: { scope: context.scopeId } }
          : undefined;
      const response = await resolved.api.search(query, filters);
      const fragments: { fragment: PagefindFragment; score?: number }[] = [];

      // Hydrate fragments lazily; each page yields at least one result, so
      // `limit` pages is always enough to fill `limit` results.
      for (const result of response.results.slice(0, limit)) {
        fragments.push({ fragment: await result.data(), score: result.score });
      }

      return mapPagefindResults(fragments, limit);
    },
  };
}
