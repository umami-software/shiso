import { type MdNode, toText, walkTree } from './mdast.ts';
import { compileMermaid } from './mermaid.ts';

/**
 * Compiles Mermaid diagrams to SVG at build time with Ondine
 * (https://ondine.sh), so pages ship static, theme-aware SVG and no diagram
 * renderer runs in the browser.
 *
 * Two sources are handled:
 * - ```mermaid fences, which `rehype-shiki` has already tagged with
 *   `data-language="mermaid"`. The SVG goes on `data-svg` for `CodeBlock`.
 * - `<Mermaid>` JSX whose definition is static (`chart="..."`,
 *   ``chart={`...`}``, or text children). The SVG goes on an `svg` prop.
 *
 * The raw definition stays in the markup either way, for search and no-JS
 * fallbacks. A definition that fails to compile gets `data-error` / `error`
 * instead, which the component shows in place of the diagram. Dynamic charts
 * (`chart={someVariable}`) are left alone and compile client-side.
 */

interface JsxAttribute {
  type: string;
  name?: string;
  value?: unknown;
}

interface EstreeNode {
  type: string;
  value?: unknown;
  expression?: EstreeNode;
  expressions?: unknown[];
  quasis?: { value: { cooked?: string | null } }[];
  body?: EstreeNode[];
}

/** Trims the blank lines MDX leaves around a definition, mirroring `mermaidSource`. */
function cleanSource(raw: string): string {
  return raw.replace(/^\n+|\n+$/g, '').replace(/\\n$/, '');
}

/** Reads a string or interpolation-free template literal from a `{...}` attribute. */
function staticExpressionValue(value: unknown): string | undefined {
  const estree = (value as { data?: { estree?: EstreeNode } })?.data?.estree;
  const expression = estree?.body?.[0]?.expression;
  if (expression?.type === 'Literal' && typeof expression.value === 'string') {
    return expression.value;
  }
  if (expression?.type === 'TemplateLiteral' && !expression.expressions?.length) {
    return expression.quasis?.[0]?.value.cooked ?? undefined;
  }
  return undefined;
}

/** Diagram source of a `<Mermaid>` element, or undefined when only known at runtime. */
function jsxSource(node: MdNode): string | undefined {
  const attributes = (node.attributes || []) as JsxAttribute[];
  const chart = attributes.find(attribute => attribute.name === 'chart');

  if (chart) {
    const raw = typeof chart.value === 'string' ? chart.value : staticExpressionValue(chart.value);
    if (raw?.trim()) {
      return cleanSource(raw);
    }
    // A blank chart falls back to children, as the component does.
    if (raw === undefined) {
      return undefined;
    }
  }

  const children = node.children || [];
  // Children containing JSX expressions (`{...}`) can't be read statically.
  let dynamic = false;
  walkTree({ children }, child => {
    if (child.type === 'mdxFlowExpression' || child.type === 'mdxTextExpression') {
      dynamic = true;
    }
  });
  if (dynamic) {
    return undefined;
  }

  // MDX parses the children as Markdown (usually one paragraph); join blocks on newlines.
  return cleanSource(children.map(child => toText(child)).join('\n'));
}

function warn(file: { path?: string } | undefined, error: string) {
  console.warn(
    `[shiso] Mermaid diagram${file?.path ? ` in ${file.path}` : ''} failed to compile: ${error}`,
  );
}

export function rehypeMermaid() {
  return (tree: MdNode, file?: { path?: string }) => {
    walkTree(tree, node => {
      // ```mermaid fences, tagged by rehype-shiki.
      if (node.tagName === 'pre') {
        const properties = (node.properties || {}) as Record<string, unknown>;
        if (properties['data-language'] !== 'mermaid' || properties['data-svg'] !== undefined) {
          return;
        }
        const code = node.children?.find(child => child.tagName === 'code');
        const source = cleanSource(toText(code));
        if (!source.trim()) {
          return;
        }
        const result = compileMermaid(source);
        if (result.error !== undefined) {
          warn(file, result.error);
          properties['data-error'] = result.error;
        } else {
          properties['data-svg'] = result.svg;
        }
        node.properties = properties;
        return;
      }

      // <Mermaid> JSX in MDX.
      const isJsx = node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';
      if (!isJsx || node.name !== 'Mermaid') {
        return;
      }
      const attributes = (node.attributes || []) as JsxAttribute[];
      if (attributes.some(attribute => attribute.name === 'svg' || attribute.name === 'error')) {
        return;
      }
      const source = jsxSource(node);
      if (!source?.trim()) {
        return;
      }
      const result = compileMermaid(source);
      if (result.error !== undefined) {
        warn(file, result.error);
      }
      node.attributes = [
        ...attributes,
        result.error !== undefined
          ? { type: 'mdxJsxAttribute', name: 'error', value: result.error }
          : { type: 'mdxJsxAttribute', name: 'svg', value: result.svg },
      ];
    });
  };
}
