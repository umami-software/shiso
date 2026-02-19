'use client';
import type { BoxProps } from '@umami/react-zen';
import { Box, Column, Text } from '@umami/react-zen';
import { useEffect, useState } from 'react';

export interface PageLinksProps extends BoxProps {
  items?: { name: string; id: string; size: number }[];
}

export function PageLinks({ items = [], className, ...props }: PageLinksProps) {
  const [hash, setHash] = useState(items?.[0]?.id);

  useEffect(() => {
    setHash(items?.[0]?.id);

    const callback = () => {
      const x = [...items].reverse().find(({ id }) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return rect && rect.top <= 0;
      });

      if (x) setHash(x.id);
    };

    window.addEventListener('scroll', callback, false);

    return () => {
      window.removeEventListener('scroll', callback, false);
    };
  }, [items]);

  if (!items?.length) {
    return null;
  }

  const indent = (size: number) => {
    if (size <= 2) {
      return '0px';
    }

    return `${(size - 2) * 10}px`;
  };

  return (
    <Box {...props} className={className} position="sticky" height="max-content" minWidth="240px">
      <Column gap="3" minWidth="240px">
        <Text size="sm" weight="bold">
          On this page
        </Text>
        {items.map(({ name, id, size }) => {
          const selected = hash === id;

          return (
            <a key={id} href={`#${id}`} style={{ textDecoration: 'none' }}>
              <Text size="sm" color={selected ? 'primary' : 'muted'}>
                <span style={{ marginLeft: indent(size), display: 'block' }}>{name}</span>
              </Text>
            </a>
          );
        })}
      </Column>
    </Box>
  );
}
