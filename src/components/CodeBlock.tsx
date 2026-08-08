import { type ReactNode, useRef, useState } from 'react';
import { CheckIcon, Copy } from '@/components/icons';

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
    <pre
      ref={textInput}
      className={`relative my-5 overflow-auto rounded-[var(--radius-lg)] border border-[var(--color-code-border)] bg-[var(--color-code-bg)] p-5 text-[0.9rem] text-[var(--color-code-text)] leading-[1.6] [font-family:var(--font-mono)] ${className || ''}`}
    >
      {children}
      <button
        type="button"
        className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[#fafafa]"
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? <CheckIcon size={14} className="text-[#4ade80]" /> : <Copy size={14} />}
      </button>
    </pre>
  );
}
