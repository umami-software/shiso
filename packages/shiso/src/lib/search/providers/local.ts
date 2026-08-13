import type { SearchRecord } from '@/lib/search';
import { searchIndex } from '@/lib/search';
import type { SearchProvider } from '@/lib/search/provider';

/** Built-in provider backed by the section index generated during the build. */
export function createLocalSearchProvider(_options: Record<string, unknown> = {}): SearchProvider {
  let records: Promise<SearchRecord[]> | null = null;

  return {
    async search(query, limit) {
      records ||= import('@/lib/search-index.generated').then(module => module.SEARCH_INDEX);
      return searchIndex(await records, query, limit);
    },
  };
}
