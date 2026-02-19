import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';

interface NodeWithClassName {
  className?: string;
  children?: ReactNode;
}

export function toElementArray<T>(children: ReactNode): ReactElement<T>[] {
  return Children.toArray(children).filter(isValidElement) as ReactElement<T>[];
}

export function slugify(value: ReactNode, fallback: string): string {
  const text = typeof value === 'string' ? value : '';
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || fallback;
}

export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      return String.fromCodePoint(Number.parseInt(hex, 16));
    })
    .replace(/&#([0-9]+);/g, (_, decimal) => {
      return String.fromCodePoint(Number.parseInt(decimal, 10));
    })
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function normalizeLanguage(value: string): string {
  const label = value.toLowerCase();
  const aliases: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    sh: 'shell',
    zsh: 'shell',
    shell: 'shell',
    bash: 'bash',
    yml: 'yaml',
    md: 'markdown',
  };

  return aliases[label] || label;
}

export function findCodeLanguage(node: ReactNode): string | undefined {
  if (!isValidElement<NodeWithClassName>(node)) {
    return undefined;
  }

  const className = node.props.className;
  if (typeof className === 'string') {
    const match = className.match(/language-([a-z0-9-]+)/i);
    if (match?.[1]) {
      return normalizeLanguage(match[1]);
    }
  }

  return findCodeLanguage(node.props.children);
}
