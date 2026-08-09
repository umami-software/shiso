import type { SearchConfig } from '@/lib/types';

export const DEFAULT_SEARCH_PROMPT = 'Search...';
export const DEFAULT_SEARCH_PROVIDER = 'local';

export interface ResolvedSearchConfig {
  enabled: boolean;
  prompt: string;
  provider: string;
  options: Record<string, unknown>;
}

/** Normalizes docs.json search settings for both the UI and provider loader. */
export function resolveSearchConfig(
  config: false | SearchConfig | undefined,
): ResolvedSearchConfig {
  if (config === false) {
    return {
      enabled: false,
      prompt: DEFAULT_SEARCH_PROMPT,
      provider: DEFAULT_SEARCH_PROVIDER,
      options: {},
    };
  }

  return {
    enabled: true,
    prompt: config?.prompt?.trim() || DEFAULT_SEARCH_PROMPT,
    provider: config?.provider?.trim().toLowerCase() || DEFAULT_SEARCH_PROVIDER,
    options: config?.options || {},
  };
}
