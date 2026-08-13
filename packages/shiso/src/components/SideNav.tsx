import classNames from 'classnames';
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { resolveIcon } from '@/components/docs/utils';
import { ChevronRight, ExternalLink } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { flattenNav, isNodeHidden } from '@/lib/docs-config';
import type { DocsTab, NavGroupNode, NavNode } from '@/lib/types';

const sectionLabelClass =
  'flex min-w-0 flex-1 items-center gap-[0.4rem] pb-2 pr-1 font-bold text-inherit';
const groupLabelClass =
  'flex min-w-0 flex-1 items-center gap-[0.4rem] px-3 py-2 font-medium text-inherit';
const selectedClass =
  'border-l-sidebar-primary font-medium text-sidebar-primary hover:text-sidebar-primary';

export interface SideNavProps {
  tabs: DocsTab[];
  navigation: Record<string, NavNode[]>;
  anchors: NavNode[];
  isSticky?: boolean;
  drilldown?: boolean;
  navigationLabel: string;
  expandLabel: string;
  collapseLabel: string;
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
  drilldown,
  expandLabel,
  collapseLabel,
}: {
  node: NavGroupNode;
  pathname: string;
  depth: number;
  drilldown?: boolean;
  expandLabel: string;
  collapseLabel: string;
}) {
  const navigate = useNavigate();
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

  const handleOpenChange = (next: boolean) => {
    setExpanded(next);

    if (next && drilldown === true && firstPage) {
      navigate(firstPage.url);
    }
  };

  const chevron = (
    <ChevronRight className="size-3.5 shrink-0 origin-center text-muted-foreground transition-[color,transform] duration-150 group-hover/section:text-sidebar-accent-foreground group-aria-expanded/collapsible-trigger:rotate-90" />
  );

  const isTopLevel = depth === 0;
  const rootSelected = node.root?.page.url === pathname;
  const headerClass = isTopLevel
    ? 'flex min-w-0 items-center text-sidebar-foreground'
    : classNames(
        'flex items-center border-sidebar-border border-l text-muted-foreground hover:text-sidebar-accent-foreground',
        { 'pl-6': depth > 1 },
      );

  const fixedHeader = (
    <div
      className={classNames(headerClass, {
        [selectedClass]: rootSelected && !isTopLevel,
        'text-sidebar-primary': rootSelected && isTopLevel,
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
        'text-sidebar-primary': rootSelected && isTopLevel,
      })}
    >
      <Link to={node.root.page.url} className={isTopLevel ? sectionLabelClass : groupLabelClass}>
        {resolveIcon(node.icon)}
        {node.label}
      </Link>
      <CollapsibleTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={classNames(
              'group/collapsible-trigger inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              { 'mr-[0.35rem]': !isTopLevel },
            )}
            aria-label={`${isExpanded ? collapseLabel : expandLabel} ${node.label}`}
          />
        }
      >
        {chevron}
      </CollapsibleTrigger>
    </div>
  ) : (
    <CollapsibleTrigger
      render={
        <Button
          type="button"
          variant="ghost"
          className={classNames(
            headerClass,
            'group/section group/collapsible-trigger flex h-auto w-full items-center justify-start gap-[0.4rem] whitespace-normal rounded-none px-0 py-0 text-left hover:bg-transparent aria-expanded:bg-transparent dark:hover:bg-transparent [&>svg:last-child]:ml-auto',
            {
              'pb-2 font-bold text-sidebar-foreground': isTopLevel,
              'border-sidebar-border border-l px-3 py-2 font-medium text-muted-foreground hover:text-sidebar-accent-foreground':
                !isTopLevel,
            },
          )}
        />
      }
    >
      {resolveIcon(node.icon)}
      {node.label}
      {chevron}
    </CollapsibleTrigger>
  );

  if (!collapsible) {
    return (
      <div className="flex flex-col">
        {fixedHeader}
        <div className="flex flex-col">
          <NavNodes
            nodes={node.children}
            pathname={pathname}
            depth={depth + 1}
            drilldown={drilldown}
            expandLabel={expandLabel}
            collapseLabel={collapseLabel}
          />
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={expanded} onOpenChange={handleOpenChange} className="flex flex-col">
      {header}
      <CollapsibleContent>
        <div className="flex flex-col">
          <NavNodes
            nodes={node.children}
            pathname={pathname}
            depth={depth + 1}
            drilldown={drilldown}
            expandLabel={expandLabel}
            collapseLabel={collapseLabel}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function NavNodes({
  nodes,
  pathname,
  depth,
  drilldown,
  expandLabel,
  collapseLabel,
}: {
  nodes: NavNode[];
  pathname: string;
  depth: number;
  drilldown?: boolean;
  expandLabel: string;
  collapseLabel: string;
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
          target={node.target}
          rel={node.target === '_blank' ? 'noreferrer' : undefined}
          className={classNames(
            'flex min-w-0 items-center gap-[0.4rem] border-sidebar-border border-l px-3 py-[0.55rem] text-muted-foreground hover:text-sidebar-accent-foreground [overflow-wrap:anywhere]',
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
            'flex min-w-0 items-center gap-[0.4rem] border-sidebar-border border-l px-3 py-[0.55rem] [overflow-wrap:anywhere]',
            {
              'pl-6': depth > 1,
              [selectedClass]: isSelected,
              'text-muted-foreground hover:text-sidebar-accent-foreground': !isSelected,
            },
          )}
        >
          {resolveIcon(icon)}
          {label}
          {tag ? (
            <Badge
              variant="secondary"
              className="ml-auto h-auto rounded-sm px-[0.35rem] py-[0.05rem] text-[0.7rem] text-muted-foreground uppercase"
            >
              {tag}
            </Badge>
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
        drilldown={drilldown}
        expandLabel={expandLabel}
        collapseLabel={collapseLabel}
      />,
    );
  });

  return <>{rendered}</>;
}

export function SideNav({
  tabs,
  navigation,
  anchors,
  isSticky,
  drilldown,
  navigationLabel,
  expandLabel,
  collapseLabel,
}: SideNavProps) {
  const { pathname } = useLocation();

  const tab = [...tabs]
    .sort((a, b) => b.url.length - a.url.length)
    .find(item => pathname === item.url || pathname.startsWith(`${item.url}/`));
  const nodes = navigation[tab?.id || tabs?.[0]?.id] || [];

  return (
    <ScrollArea className={classNames('w-full max-w-full', { 'h-full': isSticky })}>
      <nav className="flex w-full flex-col gap-6 pr-4 text-sm" aria-label={navigationLabel}>
        {anchors.length ? (
          <NavNodes
            nodes={anchors}
            pathname={pathname}
            depth={0}
            drilldown={drilldown}
            expandLabel={expandLabel}
            collapseLabel={collapseLabel}
          />
        ) : null}
        <NavNodes
          nodes={nodes}
          pathname={pathname}
          depth={0}
          drilldown={drilldown}
          expandLabel={expandLabel}
          collapseLabel={collapseLabel}
        />
      </nav>
    </ScrollArea>
  );
}
