import { Box, Button, Icon } from '@umami/react-zen';
import { type ReactNode, useRef, useState } from 'react';
import { CheckIcon, Copy } from '@/components/icons';

export interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const textInput = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    navigator?.clipboard?.writeText(textInput.current?.textContent || '');

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Box
      as="pre"
      ref={textInput}
      className={className}
      position="relative"
      marginY="5"
      padding="5"
      overflow="auto"
      border
      borderColor="zinc-700"
      borderRadius="lg"
      backgroundColor="surface-inverted"
      color="inverted"
      style={{ fontFamily: 'var(--font-family-mono)' }}
    >
      {children}
      <Box position="absolute" top="0.75rem" right="0.75rem">
        <Button variant="quiet" size="sm" onPress={handleCopy} aria-label="Copy code">
          <Icon size="sm" color={copied ? 'green-500' : 'muted'}>
            {copied ? <CheckIcon /> : <Copy />}
          </Icon>
        </Button>
      </Box>
    </Box>
  );
}
