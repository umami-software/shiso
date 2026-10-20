import mdx from '@mdx-js/rollup';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import type { Plugin } from 'vite';
import { resolveCodeBlockConfig } from './src/lib/code-blocks.ts';
import { type MdNode, toText } from './src/lib/mdast.ts';
import { rehypeShiki } from './src/lib/rehype-shiki.ts';
import { remarkToc } from './src/lib/remark-toc.ts';
import type { MdxConfig, ResolvedCodeBlockConfig } from './src/lib/types.ts';

export interface ShisoMdxOptions extends MdxConfig {
  /** Resolved docs.json `styling.codeBlocks`; defaults apply when omitted. */
  codeBlocks?: ResolvedCodeBlockConfig;
}

function rehypeZoomableImages() {
  return (tree: MdNode) => {
    const visit = (node: MdNode, insideLink = false) => {
      const isMdxElement = node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';
      const isLink = node.tagName === 'a' || (isMdxElement && node.name === 'a');
      const linked = insideLink || isLink;

      if (isMdxElement && node.name === 'img') {
        node.name = 'ZoomableImage';

        if (linked) {
          const attributes = Array.isArray(node.attributes) ? node.attributes : [];
          const hasNoZoom = attributes.some(
            attribute =>
              typeof attribute === 'object' && attribute !== null && attribute.name === 'noZoom',
          );

          if (!hasNoZoom) {
            node.attributes = [
              ...attributes,
              { type: 'mdxJsxAttribute', name: 'noZoom', value: null },
            ];
          }
        }
      } else if (node.tagName === 'img' && linked) {
        node.properties = { ...(node.properties as Record<string, unknown>), noZoom: true };
      }

      node.children?.forEach(child => {
        visit(child, linked);
      });
    };

    visit(tree);
  };
}

/**
 * The MDX compilation pipeline, shared by the app build and the test runner so
 * tests exercise the same transforms the site ships with.
 */
export function shisoMdx(options: ShisoMdxOptions = {}): Plugin {
  const codeBlocks = options.codeBlocks || resolveCodeBlockConfig();

  return {
    // Must run before vite:react-babel so MDX is compiled to JSX first.
    enforce: 'pre',
    ...mdx({
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkGfm,
        ...(options.remarkPlugins || []),
        remarkToc,
      ],
      rehypePlugins: [
        ...(options.rehypePlugins || []),
        [rehypeShiki, codeBlocks],
        rehypeZoomableImages,
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
