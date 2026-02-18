import { ReactNode } from 'react';

export interface CodeProps {
  children?: ReactNode;
  className?: string;
}

export function Code({ children, className = '' }: CodeProps) {
  return (
    <code
      className={`rounded bg-base-2 px-1.5 py-0.5 font-mono text-sm ${className}`}
    >
      {children}
    </code>
  );
}
