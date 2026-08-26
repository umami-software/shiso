import type { SearchConfig, SearchPosition } from '@/lib/types';

export const DEFAULT_SEARCH_PROMPT = 'Search...';
export const DEFAULT_SEARCH_PROVIDER = 'local';
export const DEFAULT_SEARCH_SHORTCUT = 'k';
export const DEFAULT_SEARCH_SHORTCUT_LABEL = 'Ctrl K';
export const DEFAULT_SEARCH_POSITION: SearchPosition = 'header';

/** Positions the built-in theme knows how to render. */
export const SEARCH_POSITIONS: readonly SearchPosition[] = ['header', 'sidebar'];

/**
 * Themes must always support "header", so anything unrecognized (or not
 * implemented by the active theme) lands there instead of vanishing.
 */
export function resolveSearchPosition(
  position: unknown,
  supported: readonly SearchPosition[] = SEARCH_POSITIONS,
): SearchPosition {
  if (typeof position === 'string' && (supported as readonly string[]).includes(position)) {
    return position as SearchPosition;
  }

  if (position !== undefined && position !== DEFAULT_SEARCH_POSITION) {
    console.warn(
      `[shiso] Unsupported search.position "${String(position)}" — using "${DEFAULT_SEARCH_POSITION}".`,
    );
  }

  return DEFAULT_SEARCH_POSITION;
}

export interface ResolvedSearchConfig {
  enabled: boolean;
  prompt: string;
  position: SearchPosition;
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
      position: DEFAULT_SEARCH_POSITION,
      provider: DEFAULT_SEARCH_PROVIDER,
      options: {},
      shortcut: false,
      shortcutLabel: DEFAULT_SEARCH_SHORTCUT_LABEL,
    };
  }

  return {
    enabled: true,
    prompt: config?.prompt?.trim() || DEFAULT_SEARCH_PROMPT,
    position: resolveSearchPosition(config?.position),
    provider: config?.provider?.trim().toLowerCase() || DEFAULT_SEARCH_PROVIDER,
    options: config?.options || {},
    shortcut:
      config?.shortcut === false
        ? false
        : config?.shortcut?.trim().toLowerCase() || DEFAULT_SEARCH_SHORTCUT,
    shortcutLabel: config?.shortcutLabel?.trim() || DEFAULT_SEARCH_SHORTCUT_LABEL,
  };
}
