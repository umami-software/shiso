import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { CodeBlock } from '@/components/CodeBlock';
import { Changelog } from '@/components/docs/Changelog';
import { Mermaid, mermaidSource } from '@/components/docs/Mermaid';
import { Panel } from '@/components/docs/Panel';
import { PanelProvider } from '@/components/docs/panel-context';
import { Tile, Tiles } from '@/components/docs/Tiles';
import { FileTree, Tree } from '@/components/docs/Tree';
import { Update } from '@/components/docs/Update';

describe('Update', () => {
  it('renders a label anchor, description, and tags', () => {
    const html = renderToStaticMarkup(
      <Update label="March 2025" description="v2.0.0" tags={['dashboard']}>
        <p>Body</p>
      </Update>,
    );

    expect(html).toContain('id="march-2025"');
    expect(html).toContain('href="#march-2025"');
    expect(html).toContain('v2.0.0');
    expect(html).toContain('dashboard');
    expect(html).toContain('Body');
  });

  it('accepts the rss compat prop without rendering it', () => {
    const html = renderToStaticMarkup(
      <Update label="April 2025" rss={{ title: 'April', description: 'Custom' }}>
        <p>Body</p>
      </Update>,
    );

    expect(html).toContain('id="april-2025"');
    expect(html).not.toContain('Custom');
  });
});

describe('Changelog', () => {
  const entries = (
    <>
      <Update label="March 2025" description="v2.0.0" tags={['Wintergreen', 'Spearmint']}>
        <p>First</p>
      </Update>
      <Update label="February 2025" description="v0.0.9" tags={['Spearmint']}>
        <p>Second</p>
      </Update>
    </>
  );

  it('renders tag filters for tagged updates', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <Changelog>{entries}</Changelog>
      </MemoryRouter>,
    );

    expect(html).toContain('Filter updates by tag');
    expect(html).toContain('Wintergreen');
    expect(html).toContain('Spearmint');
    expect(html).toContain('First');
    expect(html).toContain('Second');
  });

  it('filters to ?tags= entries on initial load', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/changelog?tags=Wintergreen']}>
        <Changelog>{entries}</Changelog>
      </MemoryRouter>,
    );

    expect(html).toContain('First');
    expect(html).not.toContain('Second');
  });

  it('renders a plain list when no updates are tagged', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <Changelog>
          <Update label="March 2025">
            <p>Only</p>
          </Update>
        </Changelog>
      </MemoryRouter>,
    );

    expect(html).not.toContain('Filter updates by tag');
    expect(html).toContain('Only');
  });
});

describe('Mermaid', () => {
  it('extracts the chart from the chart prop or children', () => {
    expect(mermaidSource('graph TD\n  A-->B', null)).toBe('graph TD\n  A-->B');
    expect(mermaidSource(undefined, 'flowchart LR\n  A --> B\n')).toBe('flowchart LR\n  A --> B');
  });

  it('server-renders the raw definition fallback', () => {
    const html = renderToStaticMarkup(
      <Mermaid
        chart="flowchart LR
  A --> B"
      />,
    );

    expect(html).toContain('flowchart LR');
    expect(html).toContain('Diagram source');
  });

  it('routes mermaid fences through CodeBlock to the diagram fallback', () => {
    const html = renderToStaticMarkup(
      <CodeBlock data-language="mermaid">
        <code className="language-mermaid">{'flowchart LR\n  A --> B\n'}</code>
      </CodeBlock>,
    );

    expect(html).toContain('flowchart LR');
    expect(html).not.toContain('Copy code');
  });
});

describe('Panel', () => {
  it('renders inline content for small screens', () => {
    const html = renderToStaticMarkup(
      <PanelProvider>
        <Panel>
          <p>Pinned note</p>
        </Panel>
      </PanelProvider>,
    );

    expect(html).toContain('Pinned note');
  });
});

describe('Tile', () => {
  const withRouter = (node: React.ReactNode) =>
    renderToStaticMarkup(<MemoryRouter>{node}</MemoryRouter>);

  it('renders an internal link tile with title and description', () => {
    const html = withRouter(
      <Tile href="/docs/components/card" title="Card" description="Summary cards">
        <span>Preview</span>
      </Tile>,
    );

    expect(html).toContain('href="/docs/components/card"');
    expect(html).toContain('Card');
    expect(html).toContain('Summary cards');
    expect(html).toContain('Preview');
  });

  it('opens external tiles in a new tab', () => {
    const html = withRouter(
      <Tile href="https://example.com" title="External">
        <span>Preview</span>
      </Tile>,
    );

    expect(html).toContain('target="_blank"');
  });

  it('wraps tiles in a grid', () => {
    const html = withRouter(
      <Tiles cols={2}>
        <Tile href="/a" title="A">
          <span>x</span>
        </Tile>
      </Tiles>,
    );

    expect(html).toContain('/a');
  });
});

describe('Tree', () => {
  it('renders folders and files with defaultOpen', () => {
    const html = renderToStaticMarkup(
      <Tree>
        <Tree.Folder name="app" defaultOpen>
          <Tree.File name="page.tsx" />
        </Tree.Folder>
        <Tree.File name="package.json" />
      </Tree>,
    );

    expect(html).toContain('role="tree"');
    expect(html).toContain('app');
    expect(html).toContain('page.tsx');
    expect(html).toContain('package.json');
    expect(html).toContain('aria-expanded="true"');
  });

  it('renders closed folders collapsed', () => {
    const html = renderToStaticMarkup(
      <Tree>
        <Tree.Folder name="lib">
          <Tree.File name="utils.ts" />
        </Tree.Folder>
      </Tree>,
    );

    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('hidden');
  });

  it('marks highlighted paths', () => {
    const html = renderToStaticMarkup(
      <Tree>
        <Tree.File name="page.tsx" highlight />
      </Tree>,
    );

    expect(html).toContain('data-highlight');
  });

  it('parses markdown list syntax', () => {
    const html = renderToStaticMarkup(
      <Tree>
        <ul>
          <li>
            docs/
            <ul>
              <li>index.mdx</li>
            </ul>
          </li>
          <li>docs.config.ts</li>
        </ul>
      </Tree>,
    );

    expect(html).toContain('docs/');
    expect(html).toContain('index.mdx');
    expect(html).toContain('docs.config.ts');
  });

  it('supports the FileTree alias with statics', () => {
    expect(FileTree.Folder).toBe(Tree.Folder);
    expect(FileTree.File).toBe(Tree.File);

    const html = renderToStaticMarkup(
      <FileTree>
        <FileTree.File name="readme.md" />
      </FileTree>,
    );

    expect(html).toContain('readme.md');
  });
});
