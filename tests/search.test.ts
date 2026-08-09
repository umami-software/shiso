import { describe, expect, it } from 'vitest';
import { type SearchRecord, searchIndex } from '@/lib/search';

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

  it('builds a snippet around body matches', () => {
    const results = searchIndex(records, 'moved');

    expect(results[0].snippet).toContain('moved pages');
  });

  it('respects the limit', () => {
    expect(searchIndex(records, 'docs', 1)).toHaveLength(1);
  });
});
