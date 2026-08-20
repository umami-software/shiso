import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { TocEntry } from '@/lib/types';

export interface PageLinksProps {
  items?: TocEntry[];
  title: string;
  navigationLabel: string;
}

export function PageLinks({ items = [], title, navigationLabel }: PageLinksProps) {
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
    <div className="flex h-max min-w-60 flex-col gap-3 text-sm">
      <div className="font-bold text-foreground">{title}</div>
      <nav className="flex flex-col" aria-label={navigationLabel}>
        {items.map(({ name, id, size }) => {
          const isActive = hash === id;

          return (
            <a
              key={id}
              href={`#${id}`}
              className={cn('block border-l px-3 py-1.5', {
                'border-l-primary font-medium text-primary': isActive,
                'border-border text-muted-foreground hover:text-foreground': !isActive,
              })}
              aria-current={isActive ? 'location' : undefined}
            >
              <span style={{ marginLeft: indent(size), display: 'block' }}>{name}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
