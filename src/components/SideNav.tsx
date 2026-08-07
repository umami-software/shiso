import classNames from 'classnames';
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { resolveIcon } from '@/components/docs/utils';
import { ChevronRight, ExternalLink } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
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
 * Collapsible group. Top-level groups start expanded; nested groups start
 * collapsed unless `expanded: true` or the current page is inside.
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
  // Top-level sections stay open by default so the sidebar is usable on first load.
  const [expanded, setExpanded] = useState(depth === 0 || !!node.expanded || active);

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

  const isTopLevel = depth === 0;
  const rootSelected = node.root?.page.url === pathname;
  const headerClass = isTopLevel ? styles.sectionHeader : styles.nestedHeader;

  // Navigating headers keep a separate chevron button so collapse stays reachable.
  const header =
    drilldown !== false && node.root ? (
      <div
        className={classNames(headerClass, styles.collapsibleHeader, {
          [styles.selected]: rootSelected && !isTopLevel,
          [styles.sectionSelected]: rootSelected && isTopLevel,
        })}
      >
        <Link
          to={node.root.page.url}
          className={isTopLevel ? styles.sectionLabel : styles.groupLabel}
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
        className={classNames(headerClass, styles.groupToggle, {
          [styles.sectionToggle]: isTopLevel,
        })}
        onClick={handleToggle}
        aria-expanded={expanded}
      >
        {resolveIcon(node.icon)}
        {node.label}
        {chevron}
      </button>
    );

  return (
    <div className={isTopLevel ? styles.section : styles.subsection}>
      {header}
      {expanded ? (
        <div className={isTopLevel ? styles.sectionChildren : styles.subsectionChildren}>
          <NavNodes nodes={node.children} pathname={pathname} depth={depth + 1} />
        </div>
      ) : null}
    </div>
  );
}

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
      <CollapsibleGroup
        key={`group-${node.label}`}
        node={node}
        pathname={pathname}
        depth={depth}
      />,
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
    <ScrollArea className={classNames(styles.sidenav, { [styles.sticky]: isSticky })}>
      <nav className={styles.nav} aria-label="Documentation">
        <NavNodes nodes={nodes} pathname={pathname} depth={0} />
      </nav>
    </ScrollArea>
  );
}
