import { useEffect, useState } from 'react';
import { Text, Column } from '@umami/react-zen';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import type { ColumnProps } from '@umami/react-zen';
import type { DocsTab } from '@/lib/types';
import Link from 'next/link';

export interface SideNavProps extends ColumnProps {
  tabs: DocsTab[];
  navigation: Record<string, { section: string; pages: { label: string; url: string }[] }[]>;
  isSticky?: boolean;
  autoHeight?: boolean;
}

export function SideNav({
  tabs,
  navigation,
  isSticky,
  autoHeight,
  className,
  style,
  ...props
}: SideNavProps) {
  const pathname = usePathname();

  const tab = [...(tabs || [])]
    .sort((a, b) => b.url.length - a.url.length)
    .find(({ url }) => pathname === url || pathname.startsWith(`${url}/`));
  const menu = navigation[tab?.id || tabs?.[0]?.id] || [];
  const [height, setHeight] = useState<string | undefined>();

  useEffect(() => {
    if (autoHeight) {
      const rect = document.getElementById('shiso_docs_sidenav')?.getBoundingClientRect();

      if (rect) {
        setHeight(`${window.innerHeight - rect.top - 10}px`);
      }
    }
  }, [autoHeight]);

  return (
    <Column
      {...props}
      id="shiso_docs_sidenav"
      className={classNames('shiso-side-nav', isSticky && 'is-sticky', className)}
      style={{ ...style, height }}
    >
      <Column aria-label="nav" gap="6">
        {menu.map(({ section, pages }) => {
          return (
            <Column title={section} key={section} className="shiso-side-nav-items">
              <Text weight="bold" className="shiso-side-nav-header">
                {section}
              </Text>
              {pages.map(({ label: text, url }, index: number) => {
                return (
                  <Link
                    key={index}
                    className={classNames('shiso-side-nav-item', {
                      'is-selected': url === pathname,
                    })}
                    href={url}
                  >
                    {text}
                  </Link>
                );
              })}
            </Column>
          );
        })}
      </Column>
    </Column>
  );
}
