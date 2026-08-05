/**
 * Remark plugin that collects headings from the document and injects
 * `export const toc = [{ name, id, size }, ...]` into the compiled MDX module.
 *
 * The slug algorithm must stay in sync with `rehype-slug` (github-slugger)
 * so TOC anchor ids match the heading ids rendered in the page.
 */

export interface TocEntry {
  name: string;
  id: string;
  size: number;
}

interface MdNode {
  type?: string;
  depth?: number;
  value?: string;
  children?: MdNode[];
  data?: Record<string, unknown>;
}

function walkTree(node: MdNode | undefined, visitor: (node: MdNode) => void) {
  if (!node || typeof node !== 'object') {
    return;
  }

  visitor(node);
  node.children?.forEach(child => {
    walkTree(child, visitor);
  });
}

function headingText(node: MdNode): string {
  if (!node) {
    return '';
  }

  if (typeof node.value === 'string') {
    return node.value;
  }

  return (node.children || []).map(headingText).join('');
}

function slugifyHeading(value: string, countBySlug: Map<string, number>): string {
  const base = value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const slug = base || 'section';
  const count = countBySlug.get(slug) || 0;
  countBySlug.set(slug, count + 1);
  return count ? `${slug}-${count}` : slug;
}

function valueToEstree(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) {
    return { type: 'ArrayExpression', elements: value.map(valueToEstree) };
  }

  if (value && typeof value === 'object') {
    return {
      type: 'ObjectExpression',
      properties: Object.entries(value).map(([key, val]) => ({
        type: 'Property',
        kind: 'init',
        method: false,
        shorthand: false,
        computed: false,
        key: { type: 'Identifier', name: key },
        value: valueToEstree(val),
      })),
    };
  }

  return { type: 'Literal', value };
}

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

export function remarkToc() {
  return (tree: MdNode) => {
    const toc: TocEntry[] = [];
    const countBySlug = new Map<string, number>();

    walkTree(tree, node => {
      if (node.type !== 'heading' || typeof node.depth !== 'number') {
        return;
      }

      const name = headingText(node).trim();

      if (!name) {
        return;
      }

      toc.push({
        name,
        id: slugifyHeading(name, countBySlug),
        size: node.depth,
      });
    });

    tree.children?.unshift(tocExportNode(toc));
  };
}
