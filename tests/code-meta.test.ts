import { describe, expect, it } from 'vitest';
import { parseCodeMeta } from '@/lib/code-meta';

describe('parseCodeMeta', () => {
  it('returns empty results for a missing meta string', () => {
    expect(parseCodeMeta(undefined)).toEqual({ highlightLines: [], rest: [] });
    expect(parseCodeMeta('   ')).toEqual({ highlightLines: [], rest: [] });
  });

  it('treats a bare label as the title for backwards compatibility', () => {
    expect(parseCodeMeta('npm')).toMatchObject({ title: 'npm', rest: ['npm'] });
    expect(parseCodeMeta('"My File"')).toMatchObject({ title: 'My File' });
    expect(parseCodeMeta('two words')).toMatchObject({ title: 'two words' });
  });

  it('parses quoted and bare titles', () => {
    expect(parseCodeMeta('title="app.ts"').title).toBe('app.ts');
    expect(parseCodeMeta("title='a b.ts'").title).toBe('a b.ts');
    expect(parseCodeMeta('title=app.ts').title).toBe('app.ts');
  });

  it('prefers an explicit title over leftover tokens', () => {
    expect(parseCodeMeta('title="x" extra')).toMatchObject({ title: 'x', rest: ['extra'] });
  });

  it('parses highlighted line ranges', () => {
    expect(parseCodeMeta('{1,3-5}').highlightLines).toEqual([1, 3, 4, 5]);
    expect(parseCodeMeta('{5-3} {0} {x}').highlightLines).toEqual([]);
    expect(parseCodeMeta('{2} {2,1}').highlightLines).toEqual([1, 2]);
  });

  it('parses line number directives', () => {
    expect(parseCodeMeta('showLineNumbers')).toMatchObject({ showLineNumbers: true });
    expect(parseCodeMeta('showLineNumbers=10')).toMatchObject({
      showLineNumbers: true,
      startLine: 10,
    });
    expect(parseCodeMeta('hideLineNumbers')).toMatchObject({ showLineNumbers: false });
    expect(parseCodeMeta('npm').showLineNumbers).toBeUndefined();
  });

  it('combines directives in any order', () => {
    expect(parseCodeMeta('app.ts {2} showLineNumbers')).toEqual({
      title: 'app.ts',
      highlightLines: [2],
      showLineNumbers: true,
      rest: ['app.ts'],
    });
  });
});
