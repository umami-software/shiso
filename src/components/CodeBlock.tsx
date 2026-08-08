import { type ReactNode, useRef, useState } from 'react';
import { CheckIcon, Copy } from '@/components/icons';
import { Button } from '@/components/ui/button';
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
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-2.5 right-3 inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? <CheckIcon className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  );
}
