import { useEffect, useState } from 'react';
import { Column, Text } from '@umami/react-zen';
import classNames from 'classnames';
import styles from './PageLinks.module.css';

export function PageLinks({ items, offset = 0 }) {
  const [hash, setHash] = useState(items?.[0]?.id);

  useEffect(() => {
    const callback = () => {
      const x = [...items].reverse().find(({ id }) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return rect && rect.top <= offset;
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
    <Column gap="3" minWidth="240px" className={styles.links}>
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
  );
}
