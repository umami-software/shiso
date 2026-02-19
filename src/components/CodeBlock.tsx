import { type ComponentPropsWithoutRef, useRef, useState } from 'react';
import { Icon } from '@umami/react-zen';
import { CheckIcon, Copy } from '@/components/icons';

type CodeBlockProps = ComponentPropsWithoutRef<'pre'>;

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
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
    <pre ref={textInput} className={['markdown-codeblock', className].filter(Boolean).join(' ')} {...props}>
      {children}
      <button type="button" aria-label="Copy code" className="markdown-codeblock-copy" onClick={handleCopy}>
        <Icon size="sm" className={copied ? 'markdown-codeblock-check' : 'markdown-codeblock-copy-icon'}>
          {copied ? <CheckIcon /> : <Copy />}
        </Icon>
      </button>
    </pre>
  );
}
