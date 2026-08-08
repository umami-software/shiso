import mdx from '@mdx-js/rollup';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import type { Plugin } from 'vite';
import { type MdNode, toText } from './src/lib/mdast.ts';
import { remarkToc } from './src/lib/remark-toc.ts';

function remarkCodeTitles() {
  return (tree: MdNode) => {
    const visit = (node: MdNode) => {
      if (node.type === 'code' && node.meta?.trim()) {
        const meta = node.meta.trim();
        const titleMatch = meta.match(/(?:^|\s)title=(?:"([^"]+)"|'([^']+)'|([^\s]+))/);
        const title = titleMatch ? titleMatch[1] || titleMatch[2] || titleMatch[3] : meta;
        const hProperties = (node.data?.hProperties || {}) as Record<string, unknown>;
        node.data = {
          ...node.data,
          hProperties: { ...hProperties, 'data-title': title },
        };
      }

      node.children?.forEach(visit);
    };

    visit(tree);
  };
}

/**
 * The MDX compilation pipeline, shared by the app build and the test runner so
 * tests exercise the same transforms the site ships with.
 */
export function shisoMdx(): Plugin {
  return {
    // Must run before vite:react-babel so MDX is compiled to JSX first.
    enforce: 'pre',
    ...mdx({
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkGfm,
        remarkCodeTitles,
        remarkToc,
      ],
      rehypePlugins: [
        rehypeHighlight,
        rehypeSlug,
        [
          // Must follow rehypeSlug: the anchor href points at the id it sets.
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            // A per-heading label keeps the permalink keyboard-reachable and
            // distinguishable, rather than aria-hidden and mouse-only.
            properties: (node: MdNode) => ({
              className: 'heading-anchor',
              'aria-label': `Permalink to “${toText(node)}”`,
            }),
            content: { type: 'text', value: '#' },
          },
        ],
      ],
    }),
  } as Plugin;
}
