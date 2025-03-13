'use client';
import { useEffect, useState } from 'react';
import { Column, Text, Box } from '@umami/react-zen';
import classNames from 'classnames';
import type { ColumnProps } from '@umami/react-zen/Column';
import styles from './PageLinks.module.css';

export interface PageLinksProps extends ColumnProps {
  items?: { name: string; id: string; size: number }[];
}

export function PageLinks({ items = [], className, ...props }: PageLinksProps) {
  const [hash, setHash] = useState(items?.[0]?.id);

  useEffect(() => {
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
  }, []);

  if (!items?.length) {
    return null;
  }

  return (
    <Box {...props} className={classNames(styles.links, className)}>
      <Column gap="3" minWidth="240px">
        <Text size="2" weight="bold">
          On this page
        </Text>
        {items.map(({ name, id, size }) => {
          return (
            <a
              key={id}
              href={`#${id}`}
              className={classNames(styles.link, styles[`indent-${size}`], {
                [styles.selected]: hash === id,
              })}
            >
              {name}
            </a>
          );
        })}
      </Column>
    </Box>
  );
}
