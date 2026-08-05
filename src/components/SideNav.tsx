import classNames from 'classnames';
import { Link, useLocation } from 'react-router';
import type { DocsNavSection, DocsTab } from '@/lib/types';
import styles from './SideNav.module.css';

export interface SideNavProps {
  tabs: DocsTab[];
  navigation: Record<string, DocsNavSection[]>;
  isSticky?: boolean;
}

export function SideNav({ tabs, navigation, isSticky }: SideNavProps) {
  const { pathname } = useLocation();

  const tab = [...(tabs || [])]
    .sort((a, b) => b.url.length - a.url.length)
    .find(({ url }) => pathname === url || pathname.startsWith(`${url}/`));
  const menu = navigation[tab?.id || tabs?.[0]?.id] || [];

  return (
    <nav
      className={classNames(styles.sidenav, { [styles.sticky]: isSticky })}
      aria-label="Documentation"
    >
      {menu.map(({ section, pages }) => (
        <div key={section} className={styles.section}>
          <div className={styles.sectionTitle}>{section}</div>
          {pages.map(({ label, url }) => (
            <Link
              key={url}
              to={url}
              className={classNames(styles.link, { [styles.selected]: url === pathname })}
            >
              {label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
