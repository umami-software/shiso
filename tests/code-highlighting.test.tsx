import { MDXProvider } from '@mdx-js/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CodeBlock } from '@/components/CodeBlock';
import * as docsComponents from '@/components/docs/index';
import Fixture from './fixtures/code-blocks.mdx';

const BLOCK = '<div data-slot="code-block" ';

/** The rendered markup of the first block for a language. */
function block(html: string, language: string): string {
  const marker = html.indexOf(`data-language="${language}"`);
  const start = html.lastIndexOf(BLOCK, marker);
  const end = html.indexOf(BLOCK, marker);
  return html.slice(start, end === -1 ? undefined : end);
}

describe('code highlighting pipeline', () => {
  const html = renderToStaticMarkup(
    <MDXProvider components={{ ...docsComponents, pre: CodeBlock }}>
      <Fixture />
    </MDXProvider>,
  );

  it('highlights with Shiki dual themes instead of highlight.js', () => {
    expect(html).toContain('--shiki-light:');
    expect(html).toContain('--shiki-dark:');
    expect(html).not.toContain('hljs');
    expect(html).toContain('class="language-ts"');
  });

  it('applies title, meta line highlights, and line numbers', () => {
    const ts = block(html, 'ts');
    expect(ts).toContain('>app.ts</div>');
    expect(ts).not.toContain('data-title=');
    expect(ts).toContain('data-line-numbers="true"');
    // data-line-start / data-line-count are consumed by CodeBlock, not forwarded.
    expect(ts).toContain('counter-reset:line 4');
    expect(ts).toContain('--code-gutter:1ch');
    expect(ts).not.toContain('data-line-start=');
    expect(ts.match(/data-highlighted=""/g)).toHaveLength(1);
  });

  it('highlights bare JSX in tsx blocks', () => {
    const tsx = block(html, 'tsx');
    expect(tsx).toContain('Button');
    expect(tsx).not.toContain('&lt;&gt;');
    expect(tsx.split('--shiki-dark:').length).toBeGreaterThan(3);
  });

  it('supports notation comments for highlights and diffs', () => {
    const js = block(html, 'js');
    expect(js).toContain('data-diff-markers="true"');
    expect(js).toContain('data-highlighted=""');
    expect(js).toContain('data-diff="remove"');
    expect(js).toContain('data-diff="add"');
    expect(js).not.toContain('[!code');
  });

  it('marks added and removed lines in diff blocks without extra markers', () => {
    const diff = block(html, 'diff');
    expect(diff).not.toContain('data-diff-markers');
    expect(diff.match(/data-diff="remove"/g)).toHaveLength(1);
    expect(diff.match(/data-diff="add"/g)).toHaveLength(1);
  });

  it('falls back to plain text for unknown languages', () => {
    const text = block(html, 'text');
    expect(text).toContain('plain text here');
  });

  it('keeps CodeGroup tab labels from bare meta tokens', () => {
    expect(html).toContain('>npm</button>');
    expect(html).toContain('>pnpm</button>');
  });
});
