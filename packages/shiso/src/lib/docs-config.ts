import { DOCS_PREFIX } from '@/lib/paths';
import { slugifyId } from '@/lib/slug';
import type {
  AnchorItem,
  DocsConfig,
  DropdownItem,
  GroupItem,
  LanguageItem,
  LinkTarget,
  NavGroupNode,
  NavLinkNode,
  NavNode,
  NavPageNode,
  NormalizedDocsConfig,
  NormalizedDocsPage,
  NormalizeOptions,
  PageItem,
  TabItem,
  VersionItem,
} from '@/lib/types';

/**
 * Resolves a page reference from docs.json (e.g. "components/tabs") to the
 * module key of a real content file (e.g. "/content/docs/components/tabs.mdx").
 * Returns undefined when no file exists for the reference.
 */
export type DocFileResolver = (fileSlug: string) => string | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function normalizeLinkTarget(href: string, target?: LinkTarget): LinkTarget {
  return target || (/^(?:#|\/|\.\.?\/)/.test(href) ? '_self' : '_blank');
}

const warned = new Set<string>();

function warnOnce(message: string) {
  if (warned.has(message)) {
    return;
  }

  warned.add(message);
  console.warn(`[shiso] ${message}`);
}

export function assertDocsConfig(value: unknown, sourceName: string): asserts value is DocsConfig {
  if (!isRecord(value)) {
    throw new Error(`Invalid docs config in "${sourceName}": expected a JSON object.`);
  }

  // Common mistake: pointing at a JSON schema document instead of an actual config object.
  if ('anyOf' in value && 'definitions' in value && !('navigation' in value)) {
    throw new Error(
      `Invalid docs config in "${sourceName}": this looks like a JSON schema, not a project config object.`,
    );
  }

  if (!isRecord(value.navigation)) {
    throw new Error(`Invalid docs config in "${sourceName}": missing "navigation" object.`);
  }
}

/** "code-blocks" -> "Code blocks". Sentence case: only the first word is capitalized. */
function toLabel(value: string): string {
  const words = value.split(/[-_]/g).filter(Boolean);

  return words
    .map((word, index) => (index === 0 ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(' ');
}

function normalizePageReference(pageRef: string): { fileSlug: string; slug: string } {
  const value = pageRef
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^docs\//, '')
    .replace(/\.mdx?$/, '')
    .replace(/\/+$/, '');

  if (!value) {
    return { fileSlug: 'index', slug: 'index' };
  }

  const fileSlug = value;
  const slug = value === 'index' ? 'index' : value.replace(/\/index$/, '') || 'index';

  return { fileSlug, slug };
}

function getDefaultLabel(fileSlug: string): string {
  const parts = fileSlug.split('/').filter(Boolean);
  const leaf = parts.at(-1) || fileSlug;
  return toLabel(leaf);
}

function pageToUrl(slug: string, docsPrefix: string): string {
  const base = docsPrefix || '';
  return slug === 'index' ? base || '/' : `${base}/${slug}`;
}

function pickDefaultItem<T extends { default?: boolean }>(items: T[]): T {
  return items.find(item => item.default) || items[0];
}

function dropdownsToTabs(dropdowns: DropdownItem[]): TabItem[] {
  return dropdowns.map((dropdown, index) => {
    const label = dropdown.dropdown?.trim();

    if (!label) {
      throw new Error(`Invalid docs config: dropdown at index ${index} is missing "dropdown".`);
    }

    return {
      tab: label,
      groups: dropdown.groups || [],
      pages: dropdown.pages || [],
      icon: dropdown.icon,
      hidden: dropdown.hidden,
      presentation: 'dropdown',
    };
  });
}

interface NavContainer {
  tabs?: TabItem[];
  dropdowns?: DropdownItem[];
  groups?: GroupItem[];
  pages?: PageItem[];
  versions?: VersionItem[];
  languages?: LanguageItem[];
}

/**
 * The mutually exclusive primary navigation modes a container may declare.
 * `groups` and `pages` combine into one simple-navigation mode.
 */
function getNavigationModes(container: NavContainer): string[] {
  const modes: string[] = [];

  if (container.tabs !== undefined) {
    modes.push('tabs');
  }

  if (container.dropdowns !== undefined) {
    modes.push('dropdowns');
  }

  if (container.versions !== undefined) {
    modes.push('versions');
  }

  if (container.languages !== undefined) {
    modes.push('languages');
  }

  if (container.groups !== undefined || container.pages !== undefined) {
    modes.push('groups/pages');
  }

  return modes;
}

/** Rejects arrays where more than one entry claims to be the default. */
function assertSingleDefault<T extends { default?: boolean }>(
  items: T[],
  kind: string,
  getLabel: (item: T) => string | undefined,
) {
  const defaults = items.filter(item => item.default === true);

  if (defaults.length > 1) {
    const labels = defaults.map(getLabel).filter(Boolean);

    throw new Error(
      `Invalid docs config: multiple ${kind} are marked "default": ${labels.join(', ')}. ` +
        `Only one ${kind.replace(/s$/, '')} may be the default.`,
    );
  }
}

/**
 * Resolves a navigation container down to a flat list of tabs.
 *
 * Versions and languages collapse to their default entry for now. That is a
 * real limitation, so the skipped entries are reported rather than silently
 * dropped; the multi-scope phases replace this by normalizing once per
 * version/locale.
 */
function getTabsFromContainer(container: NavContainer, fallbackLabel = ''): TabItem[] {
  const modes = getNavigationModes(container);

  if (modes.length > 1) {
    throw new Error(
      'Invalid docs config: navigation must define exactly one of tabs, dropdowns, ' +
        `versions, languages, or groups/pages — found ${modes.join(' and ')}.`,
    );
  }

  if (Array.isArray(container.tabs)) {
    if (!container.tabs.length) {
      throw new Error('Invalid docs config: "tabs" must contain at least one tab.');
    }

    return container.tabs;
  }

  if (Array.isArray(container.dropdowns)) {
    if (!container.dropdowns.length) {
      throw new Error('Invalid docs config: "dropdowns" must contain at least one dropdown.');
    }

    return dropdownsToTabs(container.dropdowns);
  }

  if (Array.isArray(container.groups) || Array.isArray(container.pages)) {
    return [
      {
        tab: fallbackLabel,
        groups: container.groups || [],
        pages: container.pages || [],
      },
    ];
  }

  if (Array.isArray(container.versions)) {
    if (!container.versions.length) {
      throw new Error('Invalid docs config: "versions" must contain at least one version.');
    }

    assertSingleDefault(container.versions, 'versions', (item: VersionItem) => item.version);

    const version = pickDefaultItem(container.versions);
    const skipped = container.versions.filter(item => item !== version).map(item => item.version);

    if (skipped.length) {
      warnOnce(
        `Only the default version "${version.version}" is rendered; skipped: ${skipped.join(', ')}. ` +
          'Multi-version output is not implemented yet.',
      );
    }

    return getTabsFromContainer(version, version.version?.trim() || fallbackLabel);
  }

  if (Array.isArray(container.languages)) {
    if (!container.languages.length) {
      throw new Error('Invalid docs config: "languages" must contain at least one language.');
    }

    assertSingleDefault(container.languages, 'languages', (item: LanguageItem) => item.language);

    const language = pickDefaultItem(container.languages);
    const skipped = container.languages
      .filter(item => item !== language)
      .map(item => item.language);

    if (skipped.length) {
      warnOnce(
        `Only the default language "${language.language}" is rendered; skipped: ${skipped.join(', ')}. ` +
          'Multi-language output is not implemented yet.',
      );
    }

    return getTabsFromContainer(language, language.language?.trim() || fallbackLabel);
  }

  throw new Error(
    'Invalid docs config: navigation must define tabs, dropdowns, groups, pages, versions, or languages.',
  );
}

function hasExplicitTopNavigation(container: NavContainer): boolean {
  if (
    (Array.isArray(container.tabs) && container.tabs.length > 0) ||
    (Array.isArray(container.dropdowns) && container.dropdowns.length > 0)
  ) {
    return true;
  }

  if (Array.isArray(container.versions) && container.versions.length) {
    return hasExplicitTopNavigation(pickDefaultItem(container.versions));
  }

  if (Array.isArray(container.languages) && container.languages.length) {
    return hasExplicitTopNavigation(pickDefaultItem(container.languages));
  }

  return false;
}

/* ---------------------------------------------------------------------------
 * Pass 1 — walk the config into a tree of pending nodes
 *
 * Pages cannot be fully normalized during the walk because their file paths are
 * resolved (and validated) in one batch afterwards. So the walk records page
 * references by `order`, and pass 2 swaps in the resolved pages.
 * ------------------------------------------------------------------------- */

interface PendingPage {
  fileSlug: string;
  slug: string;
  label: string;
  section: string;
  tabId: string;
  tabLabel: string;
  order: number;
  hidden?: boolean;
  icon?: string;
  tag?: string;
}

type PendingNode =
  | { kind: 'page'; order: number }
  | NavLinkNode
  | {
      kind: 'group';
      label: string;
      rootOrder?: number;
      children: PendingNode[];
      icon?: string;
      expanded?: boolean;
      collapsible?: boolean;
      hidden?: boolean;
    };

interface WalkContext {
  tabId: string;
  tabLabel: string;
  section: string;
  /** Set when an ancestor group is hidden, so descendants inherit it. */
  hidden?: boolean;
}

interface WalkState {
  pages: PendingPage[];
  order: { value: number };
}

function addPage(
  pageRef: string,
  context: WalkContext,
  state: WalkState,
  extra: { label?: string; icon?: string; tag?: string; hidden?: boolean } = {},
): number {
  const { fileSlug, slug } = normalizePageReference(pageRef);
  const order = state.order.value++;

  state.pages.push({
    fileSlug,
    slug,
    label: extra.label?.trim() || getDefaultLabel(fileSlug),
    section: context.section,
    tabId: context.tabId,
    tabLabel: context.tabLabel,
    order,
    hidden: extra.hidden || context.hidden || undefined,
    icon: extra.icon,
    tag: extra.tag,
  });

  return order;
}

function collectPages(items: PageItem[], context: WalkContext, state: WalkState): PendingNode[] {
  const nodes: PendingNode[] = [];

  items.forEach(item => {
    if (typeof item === 'string') {
      nodes.push({ kind: 'page', order: addPage(item, context, state) });
      return;
    }

    if (!isRecord(item)) {
      throw new Error(
        'Invalid docs config: page items must be strings, { page }, { href }, or { group, pages } blocks.',
      );
    }

    // External link: { href, label | anchor }
    if (typeof item.href === 'string' && item.href) {
      const label =
        (typeof item.label === 'string' && item.label.trim()) ||
        (typeof item.anchor === 'string' && item.anchor.trim());

      if (!label) {
        throw new Error(`Invalid docs config: external link "${item.href}" is missing a label.`);
      }

      nodes.push({
        kind: 'link',
        label,
        href: item.href,
        icon: typeof item.icon === 'string' ? item.icon : undefined,
        hidden: item.hidden === true || context.hidden || undefined,
        target: normalizeLinkTarget(
          item.href,
          item.target === '_self' || item.target === '_blank' ? item.target : undefined,
        ),
      });
      return;
    }

    // Page reference: { page, title | label }
    if (typeof item.page === 'string') {
      const label =
        (typeof item.label === 'string' && item.label) ||
        (typeof item.title === 'string' && item.title) ||
        undefined;

      nodes.push({
        kind: 'page',
        order: addPage(item.page, context, state, {
          label,
          icon: typeof item.icon === 'string' ? item.icon : undefined,
          tag: typeof item.tag === 'string' ? item.tag : undefined,
          hidden: item.hidden === true,
        }),
      });
      return;
    }

    // Nested group: { group, pages, root }
    if (typeof item.group === 'string' && Array.isArray(item.pages)) {
      const label = item.group.trim();

      if (!label) {
        throw new Error('Invalid docs config: navigation group is missing "group".');
      }
      const hidden = item.hidden === true || context.hidden || undefined;
      const childContext: WalkContext = { ...context, section: label, hidden };

      nodes.push({
        kind: 'group',
        label,
        rootOrder:
          typeof item.root === 'string' && item.root.trim()
            ? addPage(item.root, childContext, state)
            : undefined,
        children: collectPages(item.pages as PageItem[], childContext, state),
        icon: typeof item.icon === 'string' ? item.icon : undefined,
        expanded: item.expanded === true || undefined,
        collapsible: item.collapsible === false ? false : undefined,
        hidden,
      });
      return;
    }

    throw new Error(
      `Invalid docs config: unrecognized page item with keys [${Object.keys(item).join(', ')}]. ` +
        'Supported items are strings, { page }, { href }, or { group, pages } blocks.',
    );
  });

  return nodes;
}

function collectAnchors(anchors: AnchorItem[] | undefined): NavLinkNode[] {
  if (!Array.isArray(anchors)) {
    return [];
  }

  return anchors.map((anchor, index) => {
    const label = isRecord(anchor) && typeof anchor.anchor === 'string' ? anchor.anchor.trim() : '';
    const href = isRecord(anchor) && typeof anchor.href === 'string' ? anchor.href : '';

    if (!label || !href) {
      throw new Error(
        `Invalid docs config: anchor at index ${index} must define both "anchor" and "href".`,
      );
    }

    return {
      kind: 'link' as const,
      label,
      href,
      icon: anchor.icon,
      hidden: anchor.hidden || undefined,
      target: normalizeLinkTarget(href, anchor.target),
    };
  });
}

/* ---------------------------------------------------------------------------
 * Normalization
 * ------------------------------------------------------------------------- */

export function normalizeDocsConfig(
  docsConfig: DocsConfig,
  resolveDocFile: DocFileResolver,
  options: NormalizeOptions = {},
): NormalizedDocsConfig {
  const docsPrefix = options.docsPrefix ?? DOCS_PREFIX;
  const tabs = getTabsFromContainer(docsConfig.navigation);
  const showTabs = hasExplicitTopNavigation(docsConfig.navigation);
  const state: WalkState = { pages: [], order: { value: 0 } };
  const treeByTab = new Map<string, PendingNode[]>();
  const seenTabIds = new Set<string>();
  const tabIds: string[] = [];

  tabs.forEach((tab, index) => {
    const tabLabel = tab.tab?.trim() || '';

    if (!tabLabel && showTabs) {
      throw new Error(`Invalid docs config: tab at index ${index} is missing "tab".`);
    }

    const tabId = slugifyId(tabLabel || 'documentation', `tab-${index + 1}`);

    if (seenTabIds.has(tabId)) {
      throw new Error(
        `Invalid docs config: duplicate tab label "${tabLabel}" resolves to duplicate id "${tabId}".`,
      );
    }

    seenTabIds.add(tabId);
    tabIds.push(tabId);

    const context: WalkContext = {
      tabId,
      tabLabel,
      section: tabLabel,
      hidden: tab.hidden || undefined,
    };
    const nodes: PendingNode[] = [];
    const pagesBefore = state.pages.length;

    if (Array.isArray(tab.groups)) {
      tab.groups.forEach(group => {
        if (!group?.group || !Array.isArray(group.pages)) {
          throw new Error(`Invalid docs config: tab "${tabLabel}" has an invalid group entry.`);
        }

        nodes.push(...collectPages([group], context, state));
      });
    }

    if (Array.isArray(tab.dropdowns)) {
      tab.dropdowns.forEach((dropdown, dropdownIndex) => {
        const dropdownLabel = dropdown?.dropdown?.trim();

        if (!dropdownLabel) {
          throw new Error(
            `Invalid docs config: tab "${tabLabel}" dropdown at index ${dropdownIndex} is missing "dropdown".`,
          );
        }
        const children: PendingNode[] = [];
        const dropdownContext: WalkContext = {
          ...context,
          section: dropdownLabel,
          hidden: dropdown.hidden || context.hidden || undefined,
        };

        if (Array.isArray(dropdown.groups)) {
          dropdown.groups.forEach(group => {
            if (!group?.group || !Array.isArray(group.pages)) {
              throw new Error(
                `Invalid docs config: tab "${tabLabel}" dropdown "${dropdownLabel}" has an invalid group entry.`,
              );
            }

            children.push(...collectPages([group], dropdownContext, state));
          });
        }

        if (Array.isArray(dropdown.pages) && dropdown.pages.length) {
          children.push(...collectPages(dropdown.pages, dropdownContext, state));
        }

        nodes.push({
          kind: 'group',
          label: dropdownLabel,
          children,
          icon: dropdown.icon,
          hidden: dropdownContext.hidden,
        });
      });
    }

    if (Array.isArray(tab.pages) && tab.pages.length) {
      nodes.push(...collectPages(tab.pages, context, state));
    }

    if (state.pages.length === pagesBefore) {
      throw new Error(
        `Invalid docs config: tab "${tabLabel}" does not contain any supported page entries.`,
      );
    }

    treeByTab.set(tabId, nodes);
  });

  const pending = state.pages;

  if (!pending.length) {
    throw new Error('Invalid docs config: no pages found in navigation.');
  }

  const seenFileSlugs = new Set<string>();
  const seenRouteSlugs = new Set<string>();

  for (const page of pending) {
    if (seenFileSlugs.has(page.fileSlug)) {
      throw new Error(`Invalid docs config: duplicate page reference "${page.fileSlug}".`);
    }

    if (seenRouteSlugs.has(page.slug)) {
      throw new Error(`Invalid docs config: duplicate route slug "${page.slug}".`);
    }

    seenFileSlugs.add(page.fileSlug);
    seenRouteSlugs.add(page.slug);
  }

  const filePathBySlug = new Map(
    [...seenFileSlugs].map(fileSlug => {
      const filePath = resolveDocFile(fileSlug);

      if (!filePath) {
        throw new Error(
          `Missing docs page file for "${fileSlug}": expected "${fileSlug}.mdx" or ".md".`,
        );
      }

      return [fileSlug, filePath] as const;
    }),
  );

  const pageBySlug: Record<string, NormalizedDocsPage> = {};
  const pageByLookupSlug: Record<string, NormalizedDocsPage> = {};
  const pageByOrder = new Map<number, NormalizedDocsPage>();
  const pages: NormalizedDocsPage[] = [];

  for (const page of pending) {
    const filePath = filePathBySlug.get(page.fileSlug);

    if (!filePath) {
      throw new Error(`Invalid docs config: failed to resolve file for "${page.fileSlug}".`);
    }

    const normalized: NormalizedDocsPage = {
      ...page,
      url: pageToUrl(page.slug, docsPrefix),
      filePath,
    };

    pages.push(normalized);
    pageByOrder.set(normalized.order, normalized);
    pageBySlug[normalized.slug] = normalized;
    pageByLookupSlug[normalized.slug] = normalized;
    pageByLookupSlug[normalized.fileSlug] = normalized;
    pageByLookupSlug[normalized.fileSlug.replace(/\/index$/, '') || 'index'] = normalized;
  }

  // Pass 2: swap resolved pages into the pending tree.
  function materialize(node: PendingNode): NavNode | null {
    if (node.kind === 'link') {
      return node;
    }

    if (node.kind === 'page') {
      const page = pageByOrder.get(node.order);
      return page ? ({ kind: 'page', page } satisfies NavPageNode) : null;
    }

    const root = node.rootOrder === undefined ? undefined : pageByOrder.get(node.rootOrder);

    return {
      kind: 'group',
      label: node.label,
      root: root ? { kind: 'page', page: root } : undefined,
      children: node.children.map(materialize).filter((child): child is NavNode => !!child),
      icon: node.icon,
      expanded: node.expanded,
      collapsible: node.collapsible,
      hidden: node.hidden,
    } satisfies NavGroupNode;
  }

  const navigation: NormalizedDocsConfig['navigation'] = {};

  for (const [tabId, nodes] of treeByTab) {
    navigation[tabId] = nodes.map(materialize).filter((node): node is NavNode => !!node);
  }

  const firstVisiblePageByTab = new Map<string, NormalizedDocsPage>();

  for (const page of pages) {
    if (!page.hidden && !firstVisiblePageByTab.has(page.tabId)) {
      firstVisiblePageByTab.set(page.tabId, page);
    }
  }

  const normalizedTabs = tabs.map((tab, index) => {
    const tabId = tabIds[index];
    const firstPage = firstVisiblePageByTab.get(tabId);

    return {
      id: tabId,
      label: tab.tab?.trim() || '',
      url: firstPage?.url || pageToUrl('index', docsPrefix),
      icon: tab.icon,
      presentation: tab.presentation || 'tab',
      hidden: tab.hidden || undefined,
    };
  });

  return {
    name: docsConfig.name,
    tabs: normalizedTabs,
    showTabs,
    navigation,
    anchors: collectAnchors(docsConfig.navigation.anchors),
    pages,
    pageBySlug,
    pageByLookupSlug,
  };
}

/** Flattens a navigation tree to the routed pages it contains, in document order. */
export function flattenNav(nodes: NavNode[]): NormalizedDocsPage[] {
  const pages: NormalizedDocsPage[] = [];

  for (const node of nodes) {
    if (node.kind === 'page') {
      pages.push(node.page);
    } else if (node.kind === 'group') {
      if (node.root) {
        pages.push(node.root.page);
      }

      pages.push(...flattenNav(node.children));
    }
  }

  return pages;
}

/** True when a node (or all of its descendants) should be omitted from the sidebar. */
export function isNodeHidden(node: NavNode): boolean {
  if (node.kind === 'page') {
    return !!node.page.hidden;
  }

  if (node.kind === 'link') {
    return !!node.hidden;
  }

  return !!node.hidden || node.children.every(isNodeHidden);
}
