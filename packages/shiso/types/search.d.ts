export interface SearchResult {
  url: string;
  page: string;
  score: number;
  heading?: string;
  /**
   * Matched terms may be wrapped in `<mark>` tags; the search dialog renders
   * them as highlights (never as raw HTML).
   */
  snippet?: string;
}

/**
 * Where a search originates, so providers can keep results inside the
 * version/language scope being browsed. Providers may ignore it.
 */
export interface SearchContext {
  scopeId?: string;
  language?: string;
  version?: string;
}

export interface SearchProvider {
  search(query: string, limit?: number, context?: SearchContext): Promise<SearchResult[]>;
}

export type SearchProviderFactory = (
  options: Record<string, unknown>,
) => SearchProvider | Promise<SearchProvider>;

/**
 * Registers a runtime search provider. Call this before rendering the app.
 * The ids "local" and "pagefind" are reserved for the built-in providers.
 * The returned cleanup function only removes this exact registration.
 */
export function registerSearchProvider(id: string, factory: SearchProviderFactory): () => void;
