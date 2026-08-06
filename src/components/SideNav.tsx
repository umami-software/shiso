import classNames from 'classnames';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { resolveIcon } from '@/components/docs-components/utils';
import { ExternalLink } from '@/components/icons';
import { isNodeHidden } from '@/lib/docs-config';
import type { DocsTab, NavNode } from '@/lib/types';
import styles from './SideNav.module.css';

export interface SideNavProps {
  tabs: DocsTab[];
  navigation: Record<string, NavNode[]>;
  isSticky?: boolean;
}

/** Depth 0 groups get a section heading; deeper groups indent under their parent. */
function NavNodes({
  nodes,
  pathname,
  depth,
}: {
  nodes: NavNode[];
  pathname: string;
  depth: number;
}) {
  const rendered: ReactNode[] = [];

  nodes.forEach(node => {
    if (isNodeHidden(node)) {
      return;
    }

    if (node.kind === 'link') {
      rendered.push(
        <a
          key={`link-${node.href}`}
          href={node.href}
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          {resolveIcon(node.icon)}
          {node.label}
          <ExternalLink size={12} className={styles.externalIcon} />
        </a>,
      );
      return;
    }

    if (node.kind === 'page') {
      const { url, label, icon, tag } = node.page;

      rendered.push(
        <Link
          key={url}
          to={url}
          className={classNames(styles.link, { [styles.selected]: url === pathname })}
        >
          {resolveIcon(icon)}
          {label}
          {tag ? <span className={styles.tag}>{tag}</span> : null}
        </Link>,
      );
      return;
    }

    rendered.push(
      <div key={`group-${node.label}`} className={depth === 0 ? styles.section : styles.subsection}>
        {node.root ? (
          <Link
            to={node.root.page.url}
            className={classNames(styles.sectionTitle, styles.sectionLink, {
              [styles.selected]: node.root.page.url === pathname,
            })}
          >
            {resolveIcon(node.icon)}
            {node.label}
          </Link>
        ) : (
          <div className={styles.sectionTitle}>
            {resolveIcon(node.icon)}
            {node.label}
          </div>
        )}
        <NavNodes nodes={node.children} pathname={pathname} depth={depth + 1} />
      </div>,
    );
  });

  return <>{rendered}</>;
}

export function SideNav({ tabs, navigation, isSticky }: SideNavProps) {
  const { pathname } = useLocation();

  const tab = [...(tabs || [])]
    .sort((a, b) => b.url.length - a.url.length)
    .find(({ url }) => pathname === url || pathname.startsWith(`${url}/`));
  const nodes = navigation[tab?.id || tabs?.[0]?.id] || [];

  return (
    <nav
      className={classNames(styles.sidenav, { [styles.sticky]: isSticky })}
      aria-label="Documentation"
    >
      <NavNodes nodes={nodes} pathname={pathname} depth={0} />
    </nav>
  );
}
