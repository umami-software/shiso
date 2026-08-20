import mdx from '@mdx-js/rollup';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import type { Plugin } from 'vite';
import { type MdNode, toText, walkTree } from './src/lib/mdast.ts';
import { remarkToc } from './src/lib/remark-toc.ts';

const SYNTHETIC_FRAGMENT = 'data-shiso-synthetic-fragment';

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

function rehypeWrapJsxForHighlighting() {
  return (tree: MdNode) => {
    walkTree(tree, node => {
      if (node.tagName !== 'code') {
        return;
      }

      const properties = (node.properties || {}) as Record<string, unknown>;
      const className = properties.className;
      const classes = Array.isArray(className) ? className.map(String) : [String(className || '')];
      const source = toText(node);

      if (!classes.some(value => /\blanguage-(?:jsx|tsx)\b/.test(value))) {
        return;
      }

      if (!/^\s*<[A-Z][\w.]*(?:\s|>|\/)/.test(source)) {
        return;
      }

      properties[SYNTHETIC_FRAGMENT] = true;
      node.properties = properties;
      node.children = [{ type: 'text', value: `<>\n${source}\n</>` }];
    });
  };
}

function boundaryText(node: MdNode, fromEnd = false): MdNode | undefined {
  if (node.type === 'text' && typeof node.value === 'string') {
    return node;
  }

  const children = fromEnd ? [...(node.children || [])].reverse() : node.children || [];
  for (const child of children) {
    const match = boundaryText(child, fromEnd);
    if (match) {
      return match;
    }
  }

  return undefined;
}

function rehypeRemoveHighlightingFragments() {
  return (tree: MdNode) => {
    walkTree(tree, node => {
      if (node.tagName !== 'code') {
        return;
      }

      const properties = (node.properties || {}) as Record<string, unknown>;
      if (!properties[SYNTHETIC_FRAGMENT]) {
        return;
      }

      const first = boundaryText(node);
      const last = boundaryText(node, true);
      if (first?.value) {
        first.value = first.value.replace(/^<>\r?\n/, '');
      }
      if (last?.value) {
        last.value = last.value.replace(/\r?\n<\/>$/, '');
      }

      delete properties[SYNTHETIC_FRAGMENT];
    });
  };
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
        rehypeWrapJsxForHighlighting,
        rehypeHighlight,
        rehypeRemoveHighlightingFragments,
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
