import classNames from 'classnames';
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { resolveIcon } from '@/components/docs-components/utils';
import { ChevronRight, ExternalLink } from '@/components/icons';
import { flattenNav, isNodeHidden } from '@/lib/docs-config';
import { getDrilldown } from '@/lib/site-config';
import type { DocsTab, NavGroupNode, NavNode } from '@/lib/types';
import styles from './SideNav.module.css';

export interface SideNavProps {
  tabs: DocsTab[];
  navigation: Record<string, NavNode[]>;
  isSticky?: boolean;
}

/** True when the group's root or any descendant page is the current page. */
function containsPage(node: NavGroupNode, pathname: string): boolean {
  if (node.root?.page.url === pathname) {
    return true;
  }

  return flattenNav(node.children).some(page => page.url === pathname);
}

/**
 * A nested, collapsible group. Expansion starts open when the config says so
 * or when the current page is inside; navigating into the group reopens it.
 *
 * Click behavior follows `interaction.drilldown`:
 * - true: expanding also navigates to the group's root or first page
 * - false: the header only expands/collapses
 * - unset: headers with a root page navigate, others toggle
 */
function CollapsibleGroup({
  node,
  pathname,
  depth,
}: {
  node: NavGroupNode;
  pathname: string;
  depth: number;
}) {
  const navigate = useNavigate();
  const drilldown = getDrilldown();
  const active = containsPage(node, pathname);
  const [expanded, setExpanded] = useState(!!node.expanded || active);

  useEffect(() => {
    if (active) {
      setExpanded(true);
    }
  }, [active]);

  const firstPage = node.root?.page || flattenNav(node.children).find(page => !page.hidden);

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);

    if (next && drilldown === true && firstPage) {
      navigate(firstPage.url);
    }
  };

  const chevron = (
    <ChevronRight
      size={14}
      className={classNames(styles.chevron, { [styles.chevronOpen]: expanded })}
    />
  );

  // Navigating headers keep a separate chevron button so collapse stays reachable.
  const header =
    drilldown !== false && node.root ? (
      <div className={styles.collapsibleHeader}>
        <Link
          to={node.root.page.url}
          className={classNames(styles.sectionTitle, styles.sectionLink, {
            [styles.selected]: node.root.page.url === pathname,
          })}
        >
          {resolveIcon(node.icon)}
          {node.label}
        </Link>
        <button
          type="button"
          className={styles.chevronButton}
          onClick={handleToggle}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${node.label}`}
        >
          {chevron}
        </button>
      </div>
    ) : (
      <button
        type="button"
        className={classNames(styles.sectionTitle, styles.collapsibleTitle)}
        onClick={handleToggle}
        aria-expanded={expanded}
      >
        {resolveIcon(node.icon)}
        {node.label}
        {chevron}
      </button>
    );

  return (
    <div className={styles.subsection}>
      {header}
      {expanded && <NavNodes nodes={node.children} pathname={pathname} depth={depth + 1} />}
    </div>
  );
}

/** Depth 0 groups get a static section heading; deeper groups collapse. */
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

    if (depth > 0) {
      rendered.push(
        <CollapsibleGroup
          key={`group-${node.label}`}
          node={node}
          pathname={pathname}
          depth={depth}
        />,
      );
      return;
    }

    rendered.push(
      <div key={`group-${node.label}`} className={styles.section}>
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
