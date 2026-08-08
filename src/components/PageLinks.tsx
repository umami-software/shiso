import classNames from 'classnames';
import { useEffect, useState } from 'react';
import type { TocEntry } from '@/lib/types';

export interface PageLinksProps {
  items?: TocEntry[];
}

export function PageLinks({ items = [] }: PageLinksProps) {
  const [hash, setHash] = useState(items?.[0]?.id);

  useEffect(() => {
    setHash(items?.[0]?.id);

    const callback = () => {
      const found = [...items].reverse().find(({ id }) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return rect && rect.top <= 0;
      });

      if (found) {
        setHash(found.id);
      }
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
    <div className="flex h-max min-w-60 flex-col gap-3 text-[0.9rem]">
      <div className="font-bold text-[var(--color-text-strong)]">On this page</div>
      {items.map(({ name, id, size }) => (
        <a
          key={id}
          href={`#${id}`}
          className={classNames(
            'text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]',
            { 'text-[var(--color-primary)]': hash === id },
          )}
        >
          <span style={{ marginLeft: indent(size), display: 'block' }}>{name}</span>
        </a>
      ))}
    </div>
  );
}
