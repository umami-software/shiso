import classNames from 'classnames';
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { resolveIcon } from '@/components/docs/utils';
import { ChevronRight, ExternalLink } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { flattenNav, isNodeHidden } from '@/lib/docs-config';
import { getDrilldown } from '@/lib/site-config';
import type { DocsTab, NavGroupNode, NavNode } from '@/lib/types';

const sectionLabelClass =
  'flex min-w-0 flex-1 items-center gap-[0.4rem] pb-2 pr-1 font-bold text-inherit';
const groupLabelClass =
  'flex min-w-0 flex-1 items-center gap-[0.4rem] px-3 py-2 font-medium text-inherit';
const selectedClass =
  'border-l-[var(--color-primary)] font-medium text-[var(--color-primary)] hover:text-[var(--color-primary)]';

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
 * Group section. Groups with `collapsible: false` stay open; otherwise,
 * top-level groups start expanded and nested groups start collapsed unless
 * `expanded: true` or the current page is inside.
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
  const collapsible = node.collapsible !== false;
  // Top-level sections stay open by default so the sidebar is usable on first load.
  const [expanded, setExpanded] = useState(
    !collapsible || depth === 0 || !!node.expanded || active,
  );
  const isExpanded = !collapsible || expanded;

  useEffect(() => {
    if (!collapsible || active) {
      setExpanded(true);
    }
  }, [active, collapsible]);

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
      className={classNames(
        'shrink-0 origin-center text-[var(--color-text-muted)] transition-[color,transform] duration-150 group-hover/section:text-[var(--color-text-strong)]',
        {
          'rotate-90': isExpanded,
        },
      )}
    />
  );

  const isTopLevel = depth === 0;
  const rootSelected = node.root?.page.url === pathname;
  const headerClass = isTopLevel
    ? 'flex min-w-0 items-center text-[var(--color-text-strong)]'
    : classNames(
        'flex items-center border-[var(--color-border)] border-l text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]',
        { 'pl-6': depth > 1 },
      );

  const fixedHeader = (
    <div
      className={classNames(headerClass, {
        [selectedClass]: rootSelected && !isTopLevel,
        'text-[var(--color-primary)]': rootSelected && isTopLevel,
      })}
    >
      {node.root ? (
        <Link to={node.root.page.url} className={isTopLevel ? sectionLabelClass : groupLabelClass}>
          {resolveIcon(node.icon)}
          {node.label}
        </Link>
      ) : (
        <span className={isTopLevel ? sectionLabelClass : groupLabelClass}>
          {resolveIcon(node.icon)}
          {node.label}
        </span>
      )}
    </div>
  );

  // Navigating collapsible headers keep a separate chevron button so collapse stays reachable.
  const header = !collapsible ? (
    fixedHeader
  ) : drilldown !== false && node.root ? (
    <div
      className={classNames(headerClass, 'group/section flex items-center', {
        [selectedClass]: rootSelected && !isTopLevel,
        'text-[var(--color-primary)]': rootSelected && isTopLevel,
      })}
    >
      <Link to={node.root.page.url} className={isTopLevel ? sectionLabelClass : groupLabelClass}>
        {resolveIcon(node.icon)}
        {node.label}
      </Link>
      <button
        type="button"
        className={classNames(
          'inline-flex size-6 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-strong)]',
          { 'mr-[0.35rem]': !isTopLevel },
        )}
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${node.label}`}
      >
        {chevron}
      </button>
    </div>
  ) : (
    <button
      type="button"
      className={classNames(
        headerClass,
        'group/section flex w-full items-center gap-[0.4rem] text-left [&>svg:last-child]:ml-auto',
        {
          'pb-2 font-bold text-[var(--color-text-strong)]': isTopLevel,
          'border-[var(--color-border)] border-l px-3 py-2 font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]':
            !isTopLevel,
        },
      )}
      onClick={handleToggle}
      aria-expanded={isExpanded}
    >
      {resolveIcon(node.icon)}
      {node.label}
      {chevron}
    </button>
  );

  return (
    <div className="flex flex-col">
      {header}
      {isExpanded ? (
        <div className="flex flex-col">
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
          className={classNames(
            'flex min-w-0 items-center gap-[0.4rem] border-[var(--color-border)] border-l px-3 py-[0.55rem] text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)] [overflow-wrap:anywhere]',
            { 'pl-6': depth > 1 },
          )}
        >
          {resolveIcon(node.icon)}
          {node.label}
          <ExternalLink size={12} className="ml-auto opacity-60" />
        </a>,
      );
      return;
    }

    if (node.kind === 'page') {
      const { url, label, icon, tag } = node.page;
      const isSelected = url === pathname;

      rendered.push(
        <Link
          key={url}
          to={url}
          className={classNames(
            'flex min-w-0 items-center gap-[0.4rem] border-[var(--color-border)] border-l px-3 py-[0.55rem] [overflow-wrap:anywhere]',
            {
              'pl-6': depth > 1,
              [selectedClass]: isSelected,
              'text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]': !isSelected,
            },
          )}
        >
          {resolveIcon(icon)}
          {label}
          {tag ? (
            <span className="ml-auto rounded-[var(--radius-sm)] bg-[var(--color-surface-sunken)] px-[0.35rem] py-[0.05rem] text-[0.7rem] font-medium text-[var(--color-text-muted)] uppercase">
              {tag}
            </span>
          ) : null}
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
    <ScrollArea className={classNames('w-full max-w-full', { 'h-full': isSticky })}>
      <nav className="flex w-full flex-col gap-6 pr-4" aria-label="Documentation">
        <NavNodes nodes={nodes} pathname={pathname} depth={0} />
      </nav>
    </ScrollArea>
  );
}
