import { describe, expect, it } from 'vitest';
import { filterRecordsByScope, type SearchRecord, searchIndex } from '@/lib/search';

const records: SearchRecord[] = [
  { url: '/docs', page: 'Overview', text: 'Shiso is a static docs generator.' },
  {
    url: '/docs/configuration',
    page: 'Configuration',
    heading: 'Redirects',
    id: 'redirects',
    text: 'The redirects key maps moved pages to new locations.',
  },
  {
    url: '/docs/configuration',
    page: 'Configuration',
    heading: 'Fonts',
    id: 'fonts',
    text: 'Google Fonts families load automatically.',
  },
];

describe('searchIndex', () => {
  it('returns nothing for an empty query', () => {
    expect(searchIndex(records, '')).toEqual([]);
    expect(searchIndex(records, '   ')).toEqual([]);
  });

  it('matches page titles ahead of body text', () => {
    const results = searchIndex(records, 'configuration');

    expect(results[0].page).toBe('Configuration');
  });

  it('appends the heading anchor to result urls', () => {
    const results = searchIndex(records, 'redirects');

    expect(results[0].url).toBe('/docs/configuration#redirects');
  });

  it('requires every term to match', () => {
    expect(searchIndex(records, 'google automatically')).toHaveLength(1);
    expect(searchIndex(records, 'google zebra')).toHaveLength(0);
  });

  it('builds a snippet around body matches with the match highlighted', () => {
    const results = searchIndex(records, 'moved');

    expect(results[0].snippet).toContain('<mark>moved</mark> pages');
  });

  it('highlights every matching term in the snippet', () => {
    const results = searchIndex(records, 'google automatically');

    expect(results[0].snippet).toBe(
      '<mark>Google</mark> Fonts families load <mark>automatically</mark>.',
    );
  });

  it('respects the limit', () => {
    expect(searchIndex(records, 'docs', 1)).toHaveLength(1);
  });
});

describe('filterRecordsByScope', () => {
  const scoped: SearchRecord[] = [
    {
      url: '/docs/v1',
      page: 'V1 Overview',
      text: 'Legacy setup guide.',
      scopeId: 'v1',
      version: 'v1',
    },
    {
      url: '/docs/v2',
      page: 'V2 Overview',
      text: 'Current setup guide.',
      scopeId: 'v2',
      version: 'v2',
    },
    { url: '/docs/shared', page: 'Shared', text: 'Unscoped record.' },
  ];

  it('returns everything without a scope context', () => {
    expect(filterRecordsByScope(scoped)).toEqual(scoped);
    expect(filterRecordsByScope(scoped, {})).toEqual(scoped);
  });

  it('keeps only the active scope plus unscoped records', () => {
    const filtered = filterRecordsByScope(scoped, { scopeId: 'v1' });

    expect(filtered.map(record => record.url)).toEqual(['/docs/v1', '/docs/shared']);
  });

  it('does not mix versions in search results', () => {
    const results = searchIndex(filterRecordsByScope(scoped, { scopeId: 'v2' }), 'setup');

    expect(results.map(result => result.url)).toEqual(['/docs/v2']);
  });
});
