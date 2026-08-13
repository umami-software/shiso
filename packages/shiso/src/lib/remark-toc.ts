/**
 * Remark plugin that collects headings from the document and injects
 * `export const toc = [{ name, id, size }, ...]` into the compiled MDX module.
 *
 * Anchor ids come from `src/lib/slug.ts`, the same github-slugger instance
 * `rehype-slug` uses, so TOC links always match the rendered heading ids.
 */
import { valueToEstree } from 'estree-util-value-to-estree';
// Relative imports: this module is also loaded by vite.config.ts, which esbuild
// bundles without applying the "@/" resolve alias.
import { headingText, type MdNode, walkTree } from './mdast.ts';
import { createSlugger } from './slug.ts';
import type { TocEntry } from './types.ts';

function tocExportNode(toc: TocEntry[]): MdNode {
  return {
    type: 'mdxjsEsm',
    value: '',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'toc' },
                  init: valueToEstree(toc),
                },
              ],
            },
          },
        ],
      },
    },
  };
}

/** Extracts the heading outline from an mdast tree. Shared with the search indexer. */
export function collectToc(tree: MdNode): TocEntry[] {
  const toc: TocEntry[] = [];
  const slugger = createSlugger();

  walkTree(tree, node => {
    if (node.type !== 'heading' || typeof node.depth !== 'number') {
      return;
    }

    const name = headingText(node);

    if (!name) {
      return;
    }

    toc.push({ name, id: slugger.slug(name), size: node.depth });
  });

  return toc;
}

export function remarkToc() {
  return (tree: MdNode) => {
    tree.children?.unshift(tocExportNode(collectToc(tree)));
  };
}
