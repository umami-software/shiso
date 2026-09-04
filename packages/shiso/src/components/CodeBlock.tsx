import type { ReactNode } from 'react';
import { type ComponentProps, type CSSProperties, useRef, useState } from 'react';
import { CheckIcon, Copy } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Mermaid, type MermaidPlacement } from './docs/Mermaid';

/**
 * Renders a fenced code block. The `data-*` props are produced at build time by
 * `lib/rehype-shiki.ts`; see that file for the markup contract.
 */
export interface CodeBlockProps extends ComponentProps<'pre'> {
  'data-title'?: string;
  'data-language'?: string;
  'data-line-numbers'?: string;
  'data-line-start'?: string;
  'data-line-count'?: string;
  'data-diff-markers'?: string;
  'data-placement'?: MermaidPlacement;
  'data-actions'?: string;
}

function reactChildrenToText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(reactChildrenToText).join('');
  }
  if (node && typeof node === 'object' && 'props' in (node as object)) {
    const props = (node as { props?: { children?: ReactNode; value?: unknown } }).props;
    if (typeof props?.value === 'string') {
      return props.value;
    }
    return reactChildrenToText(props?.children);
  }
  return '';
}

/**
 * Joins the text of each rendered line. Lines marked as removed by
 * `// [!code --]` are skipped so the clipboard holds the "after" state; in a
 * `diff` block the +/- lines are content and are copied verbatim.
 */
function copyText(pre: HTMLPreElement | null, language?: string): string {
  if (!pre) {
    return '';
  }

  const lines = [...pre.querySelectorAll<HTMLElement>('.line')];
  if (!lines.length) {
    return pre.textContent || '';
  }

  return lines
    .filter(line => language === 'diff' || line.dataset.diff !== 'remove')
    .map(line => line.textContent || '')
    .join('\n');
}

export function CodeBlock({ children, className, style, ...rest }: CodeBlockProps) {
  const {
    'data-title': title,
    'data-language': language,
    'data-line-start': lineStart,
    'data-line-count': lineCount,
    'data-placement': placement,
    'data-actions': actions,
    ...preProps
  } = rest;
  const textInput = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // ```mermaid fences render as diagrams; the raw definition stays in the
  // markup for search indexing and no-JS fallbacks.
  if (language === 'mermaid') {
    return (
      <Mermaid
        chart={reactChildrenToText(children).replace(/\n$/, '')}
        title={title}
        placement={placement}
        actions={actions === undefined ? undefined : actions !== 'false'}
      />
    );
  }

  const start = Number(lineStart) || 1;
  const lastLine = start + Math.max(Number(lineCount) || 1, 1) - 1;
  const gutter = `${String(lastLine).length}ch`;

  const handleCopy = () => {
    setCopied(true);
    navigator?.clipboard?.writeText(copyText(textInput.current, language));

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div data-slot="code-block" className="relative my-5 overflow-hidden rounded-lg bg-card">
      {title ? (
        <div
          data-slot="code-block-header"
          className="flex h-9 items-center border-border border-b px-3 pr-12 font-mono text-muted-foreground text-xs"
        >
          {title}
        </div>
      ) : null}
      <ScrollArea scrollbars="horizontal" className="w-full">
        <pre
          ref={textInput}
          {...preProps}
          data-language={language}
          style={
            {
              ...style,
              counterReset: `line ${start - 1}`,
              '--code-gutter': gutter,
            } as CSSProperties
          }
          className={cn(
            'code-block w-max min-w-full py-3 font-mono text-foreground text-sm leading-[1.6]',
            className,
          )}
        >
          {children}
        </pre>
      </ScrollArea>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(
          'absolute right-3 inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          title ? 'top-1' : 'top-2.5',
        )}
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? <CheckIcon className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  );
}
