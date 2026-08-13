import type { ReactNode } from 'react';

/**
 * Renders the small markdown subset allowed in config strings (banner content,
 * error page descriptions): links, bold, italic, and inline code. Custom
 * components are deliberately not supported — these strings come from
 * docs.json, not MDX.
 */

interface InlinePattern {
  regex: RegExp;
  render: (match: RegExpExecArray, key: number) => ReactNode;
}

const PATTERNS: InlinePattern[] = [
  {
    // [label](https://example.com)
    regex: /\[([^\]]+)\]\(([^)\s]+)\)/,
    render: (match, key) => {
      const external = /^https?:\/\//.test(match[2]);

      return (
        <a
          key={key}
          href={match[2]}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
        >
          {renderInlineMarkdown(match[1])}
        </a>
      );
    },
  },
  {
    // **bold**
    regex: /\*\*([^*]+)\*\*/,
    render: (match, key) => <strong key={key}>{renderInlineMarkdown(match[1])}</strong>,
  },
  {
    // *italic* (single asterisk, not part of **)
    regex: /(?<!\*)\*([^*]+)\*(?!\*)/,
    render: (match, key) => <em key={key}>{renderInlineMarkdown(match[1])}</em>,
  },
  {
    // _italic_
    regex: /_([^_]+)_/,
    render: (match, key) => <em key={key}>{renderInlineMarkdown(match[1])}</em>,
  },
  {
    // `code` — contents render verbatim
    regex: /`([^`]+)`/,
    render: (match, key) => <code key={key}>{match[1]}</code>,
  },
];

export function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    let earliest: { index: number; match: RegExpExecArray; pattern: InlinePattern } | null = null;

    for (const pattern of PATTERNS) {
      const match = pattern.regex.exec(remaining);

      if (match && (!earliest || match.index < earliest.index)) {
        earliest = { index: match.index, match, pattern };
      }
    }

    if (!earliest) {
      nodes.push(remaining);
      break;
    }

    if (earliest.index > 0) {
      nodes.push(remaining.slice(0, earliest.index));
    }

    nodes.push(earliest.pattern.render(earliest.match, key++));
    remaining = remaining.slice(earliest.index + earliest.match[0].length);
  }

  return nodes;
}
