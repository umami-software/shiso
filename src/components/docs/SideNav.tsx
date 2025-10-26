import React, { useEffect, useState } from 'react';
import { Text, Column, type ColumnProps } from '@umami/react-zen';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Navigation, Page, Group } from '@/lib/types';
import { getNavigationMenu } from '@/lib/navigation';
import { SearchButton } from './SearchButton';
import styles from './SideNav.module.css';
import { useShiso } from '@/components';

const SIDENAV_ID = 'shiso_docs_sidenav';

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

  console.log({ menu, pathname });

  useEffect(() => {
    if (autoHeight) {
      const rect = document.getElementById(SIDENAV_ID)?.getBoundingClientRect();

      if (rect) {
        setHeight(`${window.innerHeight - rect.top - 10}px`);
      }
    }
  }, [autoHeight]);

  const isGroup = !!(menu?.[0] as Group)?.pages;
  const selected = pathname.slice(1);

  return (
    <Column
      {...props}
      id={SIDENAV_ID}
      className={classNames(styles.nav, isSticky && styles.sticky, className)}
      gap
      style={{ ...style, height }}
    >
      <SearchButton />

      {isGroup && (
        <Column aria-label="nav" gap="6">
          {(menu as Group[])?.map(({ group, pages }) => {
            return (
              <Column key={group} className={styles.items}>
                <Text weight="bold" className={styles.header}>
                  {group}
                </Text>
                <Items items={pages || []} selected={selected} />
              </Column>
            );
          })}
        </Column>
      )}

      {!isGroup && <Items items={menu as string[]} selected={selected} />}
    </Column>
  );
}

const Items = ({ items, selected }: { items: Page[]; selected: string }) => {
  const { mdxFiles } = useShiso();

  return (
    <Column className={styles.items}>
      {items?.map((page: string, index: number) => {
        return (
          <Link
            key={index}
            className={classNames(styles.item, {
              [styles.selected]: page === selected,
            })}
            href={`/${page}`}
          >
            {mdxFiles.find(({ slug }) => slug === page)?.meta?.title || page}
          </Link>
        );
      })}
    </Column>
  );
};
