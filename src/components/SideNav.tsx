import React from 'react';
import { Box, List, ListItem, ListSection } from '@umami/react-zen';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './SideNav.module.css';
import type { BoxProps } from '@umami/react-zen/Box';

export interface SideNavProps extends BoxProps {
  tabs: any;
  navigation: any;
}

export function SideNav({ tabs, navigation, className, ...props }: SideNavProps) {
  const pathname = usePathname();

  const tab = tabs?.find(({ url, id }) => (id !== 'docs' ? pathname.startsWith(url) : false));
  const menu = navigation[tab?.id || 'docs'];

  return (
    <Box {...props} className={classNames(styles.nav, className)}>
      <List items={navigation} aria-label="nav">
        {menu.map(({ section, pages }) => {
          return (
            <ListSection title={section} key={section} className={styles.items}>
              {pages.map(({ label: text, url }, index: number) => {
                return (
                  <ListItem
                    key={index}
                    className={classNames(styles.item, {
                      [styles.selected]: url === pathname,
                    })}
                  >
                    <Link href={url} prefetch={false}>
                      {text}
                    </Link>
                  </ListItem>
                );
              })}
            </ListSection>
          );
        })}
      </List>
    </Box>
  );
}
