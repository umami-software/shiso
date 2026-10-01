/** Runtime adapter for the shared navigation module. */
import { DOCS_PREFIX } from '@/lib/paths';
import type {
  DocsConfig,
  NormalizedDocsConfig,
  NormalizedDocsSite,
  NormalizeOptions,
} from '@/lib/types';
import {
  assertDocsConfig as assertConfig,
  getDefaultScope,
  normalizeNavigation,
} from '../../scripts/lib/navigation.mjs';

export {
  flattenNav,
  getDefaultScope,
  getLanguageScopes,
  getPageByPathname,
  getScopeById,
  getScopeForPage,
  isNodeHidden,
} from '../../scripts/lib/navigation.mjs';

/** Resolves a content reference to its module key; undefined means the file is missing. */
export type DocFileResolver = (fileSlug: string) => string | undefined;

export function assertDocsConfig(value: unknown, sourceName: string): asserts value is DocsConfig {
  assertConfig(value, sourceName);
}

export function normalizeDocsSite(
  docsConfig: DocsConfig,
  resolveDocFile: DocFileResolver,
  options: NormalizeOptions = {},
): NormalizedDocsSite {
  return normalizeNavigation(docsConfig.navigation, resolveDocFile, {
    name: docsConfig.name,
    docsPrefix: options.docsPrefix ?? DOCS_PREFIX,
  });
}

export function normalizeDocsConfig(
  docsConfig: DocsConfig,
  resolveDocFile: DocFileResolver,
  options: NormalizeOptions = {},
): NormalizedDocsConfig {
  return getDefaultScope(normalizeDocsSite(docsConfig, resolveDocFile, options)).docs;
}
