import { Children, createElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { getIcon } from '@/lib/icons';

interface NodeWithClassName {
  className?: string;
  children?: ReactNode;
}

export function toElementArray<T>(children: ReactNode): ReactElement<T>[] {
  return Children.toArray(children).filter(isValidElement) as ReactElement<T>[];
}

/**
 * Icon props accept either a rendered node or a lucide icon name, since MDX authors
 * write `icon="rocket"` while first-party components pass elements directly.
 */
export function resolveIcon(icon: ReactNode | string, size = 14): ReactNode {
  if (typeof icon !== 'string') {
    return icon;
  }

  const Component = getIcon(icon);

  return Component ? createElement(Component, { size }) : null;
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

const GRID_COLS_CLASSES = {
  1: 'gridCols1',
  2: 'gridCols2',
  3: 'gridCols3',
  4: 'gridCols4',
} as const;

/** Shared by CardGroup and Columns: clamps a column count to a CSS module class name. */
export function gridColsClass(cols: number): (typeof GRID_COLS_CLASSES)[1 | 2 | 3 | 4] {
  const columns = Math.min(Math.max(Math.round(cols) || 1, 1), 4) as 1 | 2 | 3 | 4;

  return GRID_COLS_CLASSES[columns];
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
