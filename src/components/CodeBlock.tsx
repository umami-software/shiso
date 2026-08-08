import { type ReactNode, useRef, useState } from 'react';
import { CheckIcon, Copy } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const textInput = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    navigator?.clipboard?.writeText(textInput.current?.textContent || '');

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="relative my-5 overflow-hidden rounded-lg border border-border bg-muted/50">
      <ScrollArea scrollbars="horizontal" className="w-full">
        <pre
          ref={textInput}
          className={`code-block p-3 pr-12 text-sm text-foreground leading-[1.6] font-mono ${className || ''}`}
        >
          {children}
        </pre>
      </ScrollArea>
      <button
        type="button"
        className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? <CheckIcon size={14} className="text-primary" /> : <Copy size={14} />}
      </button>
    </div>
  );
}
