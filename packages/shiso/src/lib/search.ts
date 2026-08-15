/**
 * Client-side search over the build-time index
 * (see scripts/generate-search-index.mjs).
 *
 * Plain substring scoring, no dependencies: docs sites are small enough that
 * scanning a few hundred sections per keystroke is cheap, and substring
 * matches behave predictably for exact terms like config keys.
 */

export interface SearchRecord {
  /** Base-relative route of the page. */
  url: string;
  /** Page title. */
  page: string;
  /** Section heading, absent for the page intro. */
  heading?: string;
  /** Heading anchor id, matching the rendered heading. */
  id?: string;
  /** Plain text of the section. */
  text: string;
  /** Navigation scope id, absent for single-scope sites. */
  scopeId?: string;
  /** Language label of the owning scope, when the site defines languages. */
  language?: string;
  /** Version label of the owning scope, when the site defines versions. */
  version?: string;
}

/** Where a search originates, so providers can stay inside the active scope. */
export interface SearchContext {
  scopeId?: string;
  language?: string;
  version?: string;
}

/**
 * Restricts records to the active scope. Records without a scope id (from
 * single-scope indexes or older caches) always pass.
 */
export function filterRecordsByScope(
  records: SearchRecord[],
  context?: SearchContext,
): SearchRecord[] {
  if (!context?.scopeId) {
    return records;
  }

  return records.filter(record => !record.scopeId || record.scopeId === context.scopeId);
}

export interface SearchResult {
  /** Route including the section anchor. */
  url: string;
  /** Page title. */
  page: string;
  /** Section heading, absent for the page intro. */
  heading?: string;
  /** Snippet of section text around the first match, when the text matched. */
  snippet?: string;
  /** Provider-specific relevance score. Use 0 when a provider does not expose one. */
  score: number;
}

const SNIPPET_RADIUS = 60;

function makeSnippet(text: string, index: number, length: number): string {
  const start = Math.max(0, index - SNIPPET_RADIUS);
  const end = Math.min(text.length, index + length + SNIPPET_RADIUS);

  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

export function searchIndex(records: SearchRecord[], query: string, limit = 10): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (!terms.length) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const record of records) {
    const page = record.page.toLowerCase();
    const heading = (record.heading || '').toLowerCase();
    const text = record.text.toLowerCase();

    let score = 0;
    let snippetAt = -1;
    let snippetLength = 0;
    let matched = true;

    for (const term of terms) {
      if (page.includes(term)) {
        score += page === term ? 40 : 20;
      } else if (heading.includes(term)) {
        score += heading === term ? 30 : 15;
      } else {
        const index = text.indexOf(term);

        if (index === -1) {
          matched = false;
          break;
        }

        score += 5;

        if (snippetAt === -1) {
          snippetAt = index;
          snippetLength = term.length;
        }
      }
    }

    if (!matched || !score) {
      continue;
    }

    results.push({
      url: record.id ? `${record.url}#${record.id}` : record.url,
      page: record.page,
      heading: record.heading,
      snippet: snippetAt >= 0 ? makeSnippet(record.text, snippetAt, snippetLength) : undefined,
      score,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
