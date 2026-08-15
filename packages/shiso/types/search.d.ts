export interface SearchResult {
  url: string;
  page: string;
  score: number;
  heading?: string;
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

export function registerSearchProvider(id: string, factory: SearchProviderFactory): () => void;
