// Relative import: this module is also loaded by vite.config.ts, which esbuild
// bundles without applying the '@/' resolve alias.
import type { ResolvedCodeBlockConfig, StylingConfig } from './types.ts';

export const DEFAULT_CODE_THEME = { light: 'github-light', dark: 'github-dark' } as const;

/** Applies defaults to `styling.codeBlocks` from docs.json. */
export function resolveCodeBlockConfig(styling?: StylingConfig): ResolvedCodeBlockConfig {
  const codeBlocks = styling?.codeBlocks;

  return {
    lineNumbers: codeBlocks?.lineNumbers === true,
    theme: {
      light: codeBlocks?.theme?.light || DEFAULT_CODE_THEME.light,
      dark: codeBlocks?.theme?.dark || DEFAULT_CODE_THEME.dark,
    },
  };
}
