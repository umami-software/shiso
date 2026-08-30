import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CodeBlock } from '@/components/CodeBlock';

describe('CodeBlock', () => {
  it('renders a plain block without a header', () => {
    const html = renderToStaticMarkup(
      <CodeBlock data-language="ts" data-line-count="1">
        <code className="language-ts">
          <span className="line">hi</span>
        </code>
      </CodeBlock>,
    );

    expect(html).not.toContain('data-slot="code-block-header"');
    expect(html).toContain('data-language="ts"');
    expect(html).toContain('counter-reset:line 0');
    expect(html).toContain('--code-gutter:1ch');
    expect(html).toContain('aria-label="Copy code"');
  });

  it('renders a title header and forwards line number attributes', () => {
    const html = renderToStaticMarkup(
      <CodeBlock
        data-title="app.ts"
        data-language="ts"
        data-line-numbers="true"
        data-line-start="10"
        data-line-count="3"
      >
        <code className="language-ts" />
      </CodeBlock>,
    );

    expect(html).toContain('data-slot="code-block-header"');
    expect(html).toContain('>app.ts</div>');
    expect(html).toContain('data-line-numbers="true"');
    expect(html).toContain('counter-reset:line 9');
    expect(html).toContain('--code-gutter:2ch');
    expect(html).not.toContain('data-title=');
  });
});
