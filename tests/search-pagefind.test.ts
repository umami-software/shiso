import { describe, expect, it } from 'vitest';
import {
  mapPagefindResults,
  normalizePagefindUrl,
  sanitizePagefindExcerpt,
} from '@/lib/search/providers/pagefind';

describe('sanitizePagefindExcerpt', () => {
  it('keeps mark tags and removes other markup', () => {
    expect(sanitizePagefindExcerpt('Install the <mark>tracker</mark> script.')).toBe(
      'Install the <mark>tracker</mark> script.',
    );
    expect(sanitizePagefindExcerpt('<p>Some <b>bold</b> text</p>')).toBe('Some bold text');
    expect(sanitizePagefindExcerpt('<p>A <mark>match</mark> inside</p>')).toBe(
      'A <mark>match</mark> inside',
    );
  });

  it('decodes basic HTML entities', () => {
    expect(sanitizePagefindExcerpt('Tom &amp; Jerry &lt;3 &quot;quotes&quot; &#39;here&#39;')).toBe(
      'Tom & Jerry <3 "quotes" \'here\'',
    );
  });
});

describe('normalizePagefindUrl', () => {
  it('strips index.html and trailing slashes', () => {
    expect(normalizePagefindUrl('/docs/foo/index.html')).toBe('/docs/foo');
    expect(normalizePagefindUrl('/docs/foo/')).toBe('/docs/foo');
    expect(normalizePagefindUrl('/docs/foo')).toBe('/docs/foo');
  });

  it('preserves anchors', () => {
    expect(normalizePagefindUrl('/docs/foo/index.html#setup')).toBe('/docs/foo#setup');
    expect(normalizePagefindUrl('/docs/foo/#setup')).toBe('/docs/foo#setup');
  });

  it('keeps the root path', () => {
    expect(normalizePagefindUrl('/')).toBe('/');
    expect(normalizePagefindUrl('/index.html')).toBe('/');
  });
});

describe('mapPagefindResults', () => {
  const fragment = {
    url: '/docs/install/index.html',
    excerpt: 'Page <mark>excerpt</mark>',
    meta: { title: 'Installation' },
    sub_results: [
      { title: 'Installation', url: '/docs/install/', excerpt: 'Intro <mark>text</mark>' },
      { title: 'Requirements', url: '/docs/install/#requirements', excerpt: 'Node 20+' },
      { title: 'Requirements', url: '/docs/install/index.html#requirements', excerpt: 'Dup' },
    ],
  };

  it('expands sub-results into individual results', () => {
    const results = mapPagefindResults([{ fragment, score: 2.5 }], 10);

    expect(results).toEqual([
      {
        url: '/docs/install',
        page: 'Installation',
        heading: undefined,
        snippet: 'Intro <mark>text</mark>',
        score: 2.5,
      },
      {
        url: '/docs/install#requirements',
        page: 'Installation',
        heading: 'Requirements',
        snippet: 'Node 20+',
        score: 2.5,
      },
    ]);
  });

  it('omits the heading when it matches the page title or has no anchor', () => {
    const results = mapPagefindResults([{ fragment }], 10);

    expect(results[0].heading).toBeUndefined();
    expect(results[1].heading).toBe('Requirements');
  });

  it('de-dupes results by normalized url', () => {
    const results = mapPagefindResults([{ fragment }], 10);

    expect(results.map(result => result.url)).toEqual([
      '/docs/install',
      '/docs/install#requirements',
    ]);
  });

  it('enforces the limit', () => {
    expect(mapPagefindResults([{ fragment }], 1)).toHaveLength(1);
  });

  it('defaults missing scores to 0 and falls back to the page fragment', () => {
    const bare = { url: '/docs/faq/', meta: { title: 'FAQ' }, excerpt: 'An <mark>answer</mark>' };
    const results = mapPagefindResults([{ fragment: bare }], 10);

    expect(results).toEqual([
      {
        url: '/docs/faq',
        page: 'FAQ',
        heading: undefined,
        snippet: 'An <mark>answer</mark>',
        score: 0,
      },
    ]);
  });
});
