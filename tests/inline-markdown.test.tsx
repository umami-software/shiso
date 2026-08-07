import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { renderInlineMarkdown } from '@/lib/inline-markdown';

function render(text: string): string {
  return renderToStaticMarkup(renderInlineMarkdown(text));
}

describe('renderInlineMarkdown', () => {
  it('passes plain text through', () => {
    expect(render('hello world')).toBe('hello world');
  });

  it('renders links, external ones in a new tab', () => {
    expect(render('[docs](https://example.com)')).toBe(
      '<a href="https://example.com" target="_blank" rel="noreferrer">docs</a>',
    );
    expect(render('[docs](/docs)')).toBe('<a href="/docs">docs</a>');
  });

  it('renders bold and italic', () => {
    expect(render('**bold** and *italic* and _also italic_')).toBe(
      '<strong>bold</strong> and <em>italic</em> and <em>also italic</em>',
    );
  });

  it('renders inline code verbatim', () => {
    expect(render('run `pnpm **build**`')).toBe('run <code>pnpm **build**</code>');
  });

  it('nests formatting inside links', () => {
    expect(render('[**v2** is out](https://example.com)')).toContain('<strong>v2</strong> is out');
  });

  it('escapes HTML in the source text', () => {
    expect(render('<script>alert(1)</script>')).not.toContain('<script>');
  });
});
