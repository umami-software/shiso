import type { SearchConfig } from '@/lib/types';

export const DEFAULT_SEARCH_PROMPT = 'Search...';
export const DEFAULT_SEARCH_PROVIDER = 'local';
export const DEFAULT_SEARCH_SHORTCUT = 'k';
export const DEFAULT_SEARCH_SHORTCUT_LABEL = 'Ctrl K';

export interface ResolvedSearchConfig {
  enabled: boolean;
  prompt: string;
  provider: string;
  options: Record<string, unknown>;
  shortcut: string | false;
  shortcutLabel: string;
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
      shortcut: false,
      shortcutLabel: DEFAULT_SEARCH_SHORTCUT_LABEL,
    };
  }

  return {
    enabled: true,
    prompt: config?.prompt?.trim() || DEFAULT_SEARCH_PROMPT,
    provider: config?.provider?.trim().toLowerCase() || DEFAULT_SEARCH_PROVIDER,
    options: config?.options || {},
    shortcut:
      config?.shortcut === false
        ? false
        : config?.shortcut?.trim().toLowerCase() || DEFAULT_SEARCH_SHORTCUT,
    shortcutLabel: config?.shortcutLabel?.trim() || DEFAULT_SEARCH_SHORTCUT_LABEL,
  };
}
