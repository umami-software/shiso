import React, { useEffect, useState } from 'react';
import { Text, Column, type ColumnProps } from '@umami/react-zen';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search } from './Search';
import styles from './SideNav.module.css';
import { Navigation, Page, Group } from '@/lib/types';
import { getNavigationMenu } from '@/lib/navigation';

export interface SideNavProps extends ColumnProps {
  navigation: Navigation;
  isSticky?: boolean;
  autoHeight?: boolean;
}

export function SideNav({
  navigation,
  isSticky,
  autoHeight,
  className,
  style,
  ...props
}: SideNavProps) {
  const pathname = usePathname();
  const [height, setHeight] = useState<string | undefined>();

  const menu = getNavigationMenu(pathname, navigation);

  console.log({ menu });

  useEffect(() => {
    if (autoHeight) {
      const rect = document.getElementById('shiso_docs_sidenav')?.getBoundingClientRect();

      if (rect) {
        setHeight(`${window.innerHeight - rect.top - 10}px`);
      }
    }
  }, [autoHeight]);

  const isGroup = !!(menu?.[0] as Group)?.pages;

  return (
    <Column
      {...props}
      id="shiso_docs_sidenav"
      className={classNames(styles.nav, isSticky && styles.sticky, className)}
      style={{ ...style, height }}
    >
      <Search />

      {isGroup && (
        <Column aria-label="nav" gap="6">
          {(menu as Group[])?.map(({ group, pages }) => {
            return (
              <Column key={group} className={styles.items}>
                <Text weight="bold" className={styles.header}>
                  {group}
                </Text>
                <Items items={pages || []} selected={pathname} />
              </Column>
            );
          })}
        </Column>
      )}

      {!isGroup && <Items items={menu as string[]} selected={pathname} />}
    </Column>
  );
}

const Items = ({ items, selected }: { items: Page[]; selected: string }) => {
  console.log({ items, selected });

  return (
    <Column className={styles.items}>
      {items?.map((page: string, index: number) => {
        return (
          <Link
            key={index}
            className={classNames(styles.item, {
              [styles.selected]: `/${page}` === selected,
            })}
            href={`/${page}`}
          >
            {page}
          </Link>
        );
      })}
    </Column>
  );
};
