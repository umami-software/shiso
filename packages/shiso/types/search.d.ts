export interface SearchResult {
  url: string;
  page: string;
  score: number;
  heading?: string;
  snippet?: string;
}

export interface SearchProvider {
  search(query: string, limit?: number): Promise<SearchResult[]>;
}

export type SearchProviderFactory = (
  options: Record<string, unknown>,
) => SearchProvider | Promise<SearchProvider>;

export function registerSearchProvider(id: string, factory: SearchProviderFactory): () => void;
