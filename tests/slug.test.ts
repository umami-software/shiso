import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { compile } from '@mdx-js/mdx';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { describe, expect, it } from 'vitest';
import { headingText, type MdNode, walkTree } from '@/lib/mdast';
import { collectToc } from '@/lib/remark-toc';
import { createSlugger, slugify, slugifyId } from '@/lib/slug';

/**
 * The regression this guards against: the table of contents and the rendered
 * heading ids used to be produced by two different slug implementations, so a
 * heading containing punctuation, unicode, or a duplicate title could silently
 * produce a TOC link that pointed at nothing. Both now go through
 * src/lib/slug.ts, and this test proves it against the real content.
 */

const CONTENT_DIR = path.resolve(import.meta.dirname, '../content/docs');

async function contentFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });

  const nested = await Promise.all(
    entries.map(entry => {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return contentFiles(full);
      }

      return Promise.resolve(/\.mdx?$/.test(entry.name) ? [full] : []);
    }),
  );

  return nested.flat();
}

/** Compiles a file through the real pipeline, capturing both id sources. */
async function extractIds(source: string) {
  const tocIds: string[] = [];
  const headingIds: string[] = [];

  const captureToc = () => (tree: MdNode) => {
    tocIds.push(...collectToc(tree).map(entry => entry.id));
  };

  const captureHeadingIds = () => (tree: MdNode) => {
    walkTree(tree, node => {
      if (/^h[1-6]$/.test(node.type === 'element' ? String(node.tagName) : '')) {
        const id = (node.properties as { id?: string } | undefined)?.id;

        if (id) {
          headingIds.push(id);
        }
      }
    });
  };

  await compile(source, {
    remarkPlugins: [remarkFrontmatter, remarkGfm, captureToc],
    // rehypeSlug must run before the capture so the ids exist.
    rehypePlugins: [rehypeSlug, captureHeadingIds],
  });

  return { tocIds, headingIds };
}

describe('slugify', () => {
  it('normalizes punctuation and casing', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
    // Surrounding whitespace is trimmed, but internal runs map one dash per
    // space — that is github-slugger's behavior, and deviating from it would
    // break parity with the ids rehype-slug writes onto the headings.
    expect(slugify('  Spaced   Out  ')).toBe('spaced---out');
  });

  it('de-duplicates repeated headings in document order', () => {
    const slugger = createSlugger();

    expect([slugger.slug('Setup'), slugger.slug('Setup'), slugger.slug('Setup')]).toEqual([
      'setup',
      'setup-1',
      'setup-2',
    ]);
  });

  it('falls back when a value has no slug-able characters', () => {
    expect(slugifyId('!!!', 'tab-1')).toBe('tab-1');
    expect(slugifyId('Getting Started', 'tab-1')).toBe('getting-started');
  });
});

describe('toc / heading id parity', () => {
  it('produces the same ids as rehype-slug for every content file', async () => {
    const files = await contentFiles(CONTENT_DIR);

    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const source = await readFile(file, 'utf8');
      const { tocIds, headingIds } = await extractIds(source);

      expect(
        tocIds,
        `TOC ids diverge from heading ids in ${path.relative(CONTENT_DIR, file)}`,
      ).toEqual(headingIds);
    }
  });

  it('stays in parity for headings that stress the slug algorithm', async () => {
    const source = [
      '# Title',
      '## Hello, World!',
      '## Hello, World!',
      '## `code` & symbols',
      '## Ünïcödé heading',
      '## 100% coverage',
      '### snake_case name',
    ].join('\n\n');

    const { tocIds, headingIds } = await extractIds(source);

    expect(tocIds).toEqual(headingIds);
    expect(tocIds).toContain('hello-world');
    expect(tocIds).toContain('hello-world-1');
  });
});

describe('headingText', () => {
  it('concatenates nested inline content', () => {
    const node: MdNode = {
      type: 'heading',
      depth: 2,
      children: [
        { type: 'text', value: 'Using ' },
        { type: 'inlineCode', value: 'docs.json' },
        { type: 'text', value: ' files' },
      ],
    };

    expect(headingText(node)).toBe('Using docs.json files');
  });
});
