import GithubSlugger, { slug as slugifyOnce } from 'github-slugger';

/**
 * The single slug algorithm in the repo.
 *
 * Heading anchors are produced in two independent places — `remarkToc` (which
 * builds the on-page table of contents) and `rehype-slug` (which sets the `id`
 * on the rendered heading). Both must agree or every TOC link breaks, so both
 * go through github-slugger here rather than reimplementing it.
 */

/**
 * Creates a stateful slugger. Call `.slug(text)` once per heading in document
 * order; repeated headings get `-1`, `-2`, ... suffixes exactly as rehype-slug
 * does, because it is the same implementation.
 */
export function createSlugger(): GithubSlugger {
  return new GithubSlugger();
}

/**
 * Stateless slugify for one-off ids that do not need de-duplication.
 *
 * github-slugger does not trim, so padded input would otherwise produce leading
 * and trailing dashes. Heading text is trimmed upstream by `headingText`; this
 * makes the guarantee hold for every other caller too.
 */
export function slugify(value: string): string {
  return slugifyOnce(value.trim());
}

/**
 * Slugifies a label into a config-level identifier (tab ids, section ids).
 * Falls back when the value contains no slug-able characters.
 */
export function slugifyId(value: string, fallback: string): string {
  return slugify(value) || fallback;
}
