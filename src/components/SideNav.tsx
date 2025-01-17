import React, { useEffect, useState } from 'react';
import { Box, Column, List, ListItem, ListSection } from '@umami/react-zen';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import type { BoxProps } from '@umami/react-zen/Box';
import styles from './SideNav.module.css';

export interface SideNavProps extends BoxProps {
  tabs: any;
  navigation: any;
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

  const tab = tabs?.find(({ url, id }) => (id !== 'docs' ? pathname.startsWith(url) : false));
  const menu = navigation[tab?.id || 'docs'];
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
      className={classNames(styles.nav, isSticky && styles.sticky, className)}
      style={{ ...style, height }}
    >
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
                    href={url}
                  >
                    {text}
                  </ListItem>
                );
              })}
            </ListSection>
          );
        })}
      </List>
    </Column>
  );
}
