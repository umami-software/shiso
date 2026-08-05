import classNames from 'classnames';
import { Link, useLocation } from 'react-router';
import type { DocsTab } from '@/lib/types';
import styles from './TopNav.module.css';

export function TopNav({ tabs }: { tabs: DocsTab[] }) {
  const { pathname } = useLocation();

  if (!tabs?.length) {
    return null;
  }

  const active = [...tabs]
    .sort((a, b) => b.url.length - a.url.length)
    .find(({ url }) => pathname === url || pathname.startsWith(`${url}/`));
  const selected = active?.id || tabs[0]?.id;

  return (
    <nav className={styles.nav} aria-label="Sections">
      {tabs.map(({ id, label, url }) => (
        <Link
          key={id}
          to={url}
          className={classNames(styles.tab, { [styles.selected]: id === selected })}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
