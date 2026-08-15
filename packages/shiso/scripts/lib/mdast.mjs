/**
 * Mirrors the mdast helpers in src/lib/mdast.ts for Node scripts, which must
 * not import raw TypeScript (that would depend on Node's experimental type
 * stripping). tests/script-mirrors.test.ts asserts the two stay in sync.
 */

/** Concatenates the text content of a node, including JSX text children. */
export function toText(node) {
  if (!node) {
    return '';
  }

  if (typeof node.value === 'string') {
    return node.value;
  }

  return (node.children || []).map(toText).join('');
}

/** Text of a heading node, trimmed. */
export function headingText(node) {
  return toText(node).trim();
}
