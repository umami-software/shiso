import { type ReactNode, useRef, useState } from 'react';
import { CheckIcon, Copy } from '@/components/icons';
import styles from './CodeBlock.module.css';

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
    <pre ref={textInput} className={`${styles.pre} ${className || ''}`}>
      {children}
      <button type="button" className={styles.copy} onClick={handleCopy} aria-label="Copy code">
        {copied ? <CheckIcon size={14} className={styles.copied} /> : <Copy size={14} />}
      </button>
    </pre>
  );
}
