import { MDXProvider } from '@mdx-js/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CodeBlock } from '@/components/CodeBlock';
import * as docsComponents from '@/components/docs/index';
import { Mermaid } from '@/components/docs/Mermaid';
import { compileMermaid } from '@/lib/mermaid';

/** Splits rendered markup into one chunk per diagram figure. */
function figures(html: string): string[] {
  return html.split('<figure').slice(1);
}

describe('Mermaid build-time compilation (Ondine)', () => {
  // The fixture's broken fence logs a compile warning while it is imported.
  vi.spyOn(console, 'warn').mockImplementation(() => {});

  it('compiles static diagrams to SVG and leaves dynamic ones for the client', async () => {
    const { default: Fixture } = await import('./fixtures/mermaid.mdx');
    const html = renderToStaticMarkup(
      <MDXProvider components={{ ...docsComponents, pre: CodeBlock }}>
        <Fixture />
      </MDXProvider>,
    );
    const [fence, attr, template, children, dynamic, broken] = figures(html);

    expect(fence).toContain('class="ondine ondine-flowchart"');
    expect(fence).toContain('FenceStart');
    expect(fence).toContain('Fence diagram');
    expect(fence).not.toContain('data-svg');

    expect(attr).toContain('<svg');
    expect(attr).toContain('AttrB');
    expect(template).toContain('ondine-sequence');
    expect(template).toContain('TemplateHello');
    expect(children).toContain('<svg');
    expect(children).toContain('ChildBottom');

    // A runtime-only chart server-renders the source fallback.
    expect(dynamic).not.toContain('<svg');
    expect(dynamic).toContain('Runtime --&gt; Only');

    // Invalid source shows the definition plus an error, not a diagram.
    expect(broken).not.toContain('<svg');
    expect(broken).toContain('Broken --&gt;');
    expect(broken).toContain('Parse error');
  });

  it('reports compile errors with their position', () => {
    const result = compileMermaid('flowchart LR\n  A -->');
    expect(result.svg).toBeUndefined();
    expect(result.error).toMatch(/line \d+/);
    expect(compileMermaid('not a diagram').error).toBeTruthy();
  });

  it('server-renders a precompiled svg prop without the source fallback', () => {
    const { svg } = compileMermaid('flowchart LR\n  A --> B');
    const html = renderToStaticMarkup(<Mermaid chart="flowchart LR\n  A --> B" svg={svg} />);
    expect(html).toContain('class="ondine ondine-flowchart"');
    expect(html).not.toContain('Diagram source');
  });
});
