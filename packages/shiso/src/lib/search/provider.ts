import type { SearchContext, SearchResult } from '@/lib/search';

export interface SearchProvider {
  /**
   * `context` describes the active version/language scope. Providers may
   * ignore it; the built-in local provider uses it to keep results inside
   * the scope being browsed.
   */
  search(query: string, limit?: number, context?: SearchContext): Promise<SearchResult[]>;
}

export type SearchProviderFactory = (
  options: Record<string, unknown>,
) => SearchProvider | Promise<SearchProvider>;

export interface ResolvedSearchProvider {
  provider: SearchProvider;
  providerId: string;
  fellBack: boolean;
}

const factories = new Map<string, SearchProviderFactory>();

function normalizeProviderId(id: string): string {
  return id.trim().toLowerCase();
}

/**
 * Registers a runtime search provider. Call this before rendering the app.
 * The returned cleanup function only removes this exact registration.
 */
export function registerSearchProvider(id: string, factory: SearchProviderFactory): () => void {
  const providerId = normalizeProviderId(id);

  if (!providerId || providerId === 'local') {
    throw new Error(
      'Search provider ids must be non-empty and cannot replace the built-in "local" provider.',
    );
  }

  factories.set(providerId, factory);

  return () => {
    if (factories.get(providerId) === factory) {
      factories.delete(providerId);
    }
  };
}

async function createLocalProvider(options: Record<string, unknown>): Promise<SearchProvider> {
  const { createLocalSearchProvider } = await import('@/lib/search/providers/local');
  return createLocalSearchProvider(options);
}

/** Resolves a configured provider, falling back to local for unknown ids. */
export async function resolveSearchProvider(
  id: string,
  options: Record<string, unknown> = {},
): Promise<ResolvedSearchProvider> {
  const requestedId = normalizeProviderId(id) || 'local';

  if (requestedId === 'local') {
    return {
      provider: await createLocalProvider(options),
      providerId: 'local',
      fellBack: false,
    };
  }

  const factory = factories.get(requestedId);

  if (factory) {
    return {
      provider: await factory(options),
      providerId: requestedId,
      fellBack: false,
    };
  }

  return {
    provider: await createLocalProvider({}),
    providerId: 'local',
    fellBack: true,
  };
}
