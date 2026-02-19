import type { ColumnProps } from '@umami/react-zen';
import { Column, Text } from '@umami/react-zen';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { DocsTab } from '@/lib/types';

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
      className={className}
      position={isSticky ? 'sticky' : undefined}
      overflowY="auto"
      minWidth="240px"
      style={{ ...style, height }}
    >
      <Column aria-label="nav" gap="6">
        {menu.map(({ section, pages }) => {
          return (
            <Column title={section} key={section}>
              <Column paddingY="2">
                <Text weight="bold">{section}</Text>
              </Column>
              {pages.map(({ label: text, url }) => {
                const selected = url === pathname;

                return (
                  <Link key={url} href={url} style={{ textDecoration: 'none' }}>
                    <Column
                      border="left"
                      borderColor={selected ? 'primary' : 'muted'}
                      backgroundColor={selected ? 'surface-sunken' : 'transparent'}
                      paddingY="2"
                      paddingX="3"
                    >
                      <Text
                        color={selected ? 'strong' : 'muted'}
                        weight={selected ? 'medium' : 'normal'}
                      >
                        {text}
                      </Text>
                    </Column>
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
