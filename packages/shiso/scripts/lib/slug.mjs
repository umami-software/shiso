/**
 * Mirrors src/lib/slug.ts for Node scripts, which must not import raw
 * TypeScript (that would depend on Node's experimental type stripping).
 * tests/script-mirrors.test.ts asserts the two stay in sync.
 */
import GithubSlugger, { slug as slugifyOnce } from 'github-slugger';

/** Stateful slugger matching rehype-slug: repeated headings get -1, -2, ... */
export function createSlugger() {
  return new GithubSlugger();
}

/** Stateless slugify for one-off ids that do not need de-duplication. */
export function slugify(value) {
  return slugifyOnce(value.trim());
}

/** Slugifies a label into a config-level identifier, with a fallback. */
export function slugifyId(value, fallback) {
  return slugify(value) || fallback;
}
