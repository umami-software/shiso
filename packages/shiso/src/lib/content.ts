import { LAST_MODIFIED } from '@/generated/last-modified';
import { CONTENT_DIR, PAGES_DIR } from '@/lib/paths';
import type { DocModule } from '@/lib/types';

/**
 * Eagerly imports every content file at build time. Each module exports:
 * - default: the compiled MDX component
 * - frontmatter: parsed YAML frontmatter
 * - toc: heading anchors injected by the remark-toc plugin
 *
 * Eager loading keeps server prerendering and client hydration in sync
 * without Suspense, at the cost of bundling all pages together.
 *
 * The glob pattern must be a literal for Vite to statically analyze it, so it
 * covers all of `content/` and the configured shiso.config `contentDir` is applied at
 * lookup time instead. That also lets later versioned/localized content roots
 * (`content/v2`, `content/es`) work without touching this glob.
 */
export const docModules = import.meta.glob('/content/**/*.{md,mdx}', {
  eager: true,
}) as Record<string, DocModule>;

/**
 * Resolves a docs.json page reference (e.g. "components/tabs") to a module
 * key (e.g. "/content/docs/components/tabs.mdx"). Returns undefined when the
 * file does not exist, which makes config normalization fail at startup/build.
 */
export function resolveDocFile(fileSlug: string, contentDir = CONTENT_DIR): string | undefined {
  const candidates = [`/${contentDir}/${fileSlug}.mdx`, `/${contentDir}/${fileSlug}.md`];
  return candidates.find(candidate => candidate in docModules);
}

/**
 * Resolves a standalone page slug (docs.json `pages[].page`) to a module key
 * under the fixed content/pages root.
 */
export function resolvePageFile(fileSlug: string): string | undefined {
  return resolveDocFile(fileSlug, PAGES_DIR);
}

export function getDocModule(filePath: string): DocModule | undefined {
  return docModules[filePath];
}

/**
 * Last-modified date of a content file, captured from git history at build
 * time (see scripts/generate-last-modified.mjs). ISO 8601, or undefined for
 * files outside the generated map.
 */
export function getLastModified(filePath: string): string | undefined {
  return LAST_MODIFIED[filePath];
}
