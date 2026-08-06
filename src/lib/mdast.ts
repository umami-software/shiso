/**
 * Minimal mdast helpers shared by the remark plugins and the search extractor.
 *
 * These are deliberately structural rather than typed against `@types/mdast`:
 * the trees we walk contain MDX-specific nodes (`mdxjsEsm`, `mdxJsxFlowElement`)
 * and we only ever read `type`, `depth`, `value`, and `children`.
 */

export interface MdNode {
  type?: string;
  depth?: number;
  value?: string;
  lang?: string;
  children?: MdNode[];
  data?: Record<string, unknown>;
  /**
   * The walker is also pointed at hast trees (where nodes carry `tagName` and
   * `properties`), so callers can read node-kind-specific fields without a cast.
   */
  [key: string]: unknown;
}

/** Depth-first pre-order walk, visiting the node itself first. */
export function walkTree(node: MdNode | undefined, visitor: (node: MdNode) => void) {
  if (!node || typeof node !== 'object') {
    return;
  }

  visitor(node);
  node.children?.forEach(child => {
    walkTree(child, visitor);
  });
}

/**
 * Concatenates the text content of a node. JSX elements contribute their text
 * children (so `<Tooltip>API key</Tooltip>` reads as "API key"), which is what
 * both heading anchors and the search index want.
 */
export function toText(node: MdNode | undefined): string {
  if (!node) {
    return '';
  }

  if (typeof node.value === 'string') {
    return node.value;
  }

  return (node.children || []).map(toText).join('');
}

/** Text of a heading node, trimmed. */
export function headingText(node: MdNode): string {
  return toText(node).trim();
}
