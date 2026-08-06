/* ---------------------------------------------------------------------------
 * Raw docs.json shapes
 * ------------------------------------------------------------------------- */

export interface PageObjectItem {
  page: string;
  title?: string;
  label?: string;
  icon?: string;
  tag?: string;
  hidden?: boolean;
}

/** An external link in the navigation tree. `anchor` is an alias for the label. */
export interface LinkItem {
  href: string;
  label?: string;
  anchor?: string;
  icon?: string;
  hidden?: boolean;
}

export type PageItem = string | GroupItem | PageObjectItem | LinkItem;

export interface GroupItem {
  group: string;
  root?: string;
  pages: PageItem[];
  icon?: string;
  expanded?: boolean;
  hidden?: boolean;
}

export interface DropdownItem {
  dropdown: string;
  groups?: GroupItem[];
  pages?: PageItem[];
  icon?: string;
  hidden?: boolean;
}

export interface TabItem {
  tab: string;
  groups?: GroupItem[];
  pages?: PageItem[];
  dropdowns?: DropdownItem[];
  icon?: string;
  hidden?: boolean;
}

export interface AnchorItem {
  anchor: string;
  href?: string;
  icon?: string;
  hidden?: boolean;
  groups?: GroupItem[];
  pages?: PageItem[];
}

export interface VersionItem {
  version: string;
  default?: boolean;
  hidden?: boolean;
  tabs?: TabItem[];
  dropdowns?: DropdownItem[];
  groups?: GroupItem[];
  pages?: PageItem[];
}

export interface LanguageItem {
  language: string;
  default?: boolean;
  hidden?: boolean;
  versions?: VersionItem[];
  tabs?: TabItem[];
  dropdowns?: DropdownItem[];
  groups?: GroupItem[];
  pages?: PageItem[];
}

export interface NavigationConfig {
  global?: unknown;
  tabs?: TabItem[];
  dropdowns?: DropdownItem[];
  anchors?: AnchorItem[];
  versions?: VersionItem[];
  languages?: LanguageItem[];
  groups?: GroupItem[];
  pages?: PageItem[];
  products?: unknown;
}

export interface ThemeColors {
  primary?: string;
  light?: string;
  dark?: string;
}

export type LogoOption = string | { light?: string; dark?: string; href?: string };

/** Shiso-only configuration. Namespaced so docs.json stays portable. */
export interface ShisoOptions {
  /** Where docs pages are mounted within the site. Default "/docs"; "" for root. */
  docsPrefix?: string;
  /** Content directory relative to the project root. Default "content/docs". */
  contentDir?: string;
  /** Absolute site origin, required for canonical and og:url tags. */
  siteUrl?: string;
}

export interface DocsConfig {
  $schema?: string;
  $shiso?: ShisoOptions;
  theme?: string;
  name?: string;
  colors?: ThemeColors;
  logo?: LogoOption;
  favicon?: string;
  description?: string;
  navigation: NavigationConfig;

  /**
   * Keys that are part of the config standard but not implemented yet. They are
   * accepted by the schema and ignored at runtime (see `scripts/validate-config.mjs`).
   * Typed `unknown` deliberately: code must not grow a dependency on them until
   * the corresponding feature lands and the key is given a real type above.
   */
  thumbnails?: unknown;
  styling?: unknown;
  icons?: unknown;
  fonts?: unknown;
  appearance?: unknown;
  background?: unknown;
  navbar?: unknown;
  interaction?: unknown;
  metadata?: unknown;
  footer?: unknown;
  banner?: unknown;
  redirects?: unknown;
  contextual?: unknown;
  api?: unknown;
  seo?: unknown;
  search?: unknown;
  integrations?: unknown;
  errors?: unknown;
}

/* ---------------------------------------------------------------------------
 * Normalized shapes
 * ------------------------------------------------------------------------- */

export interface DocsTab {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface NormalizedDocsPage {
  slug: string;
  fileSlug: string;
  label: string;
  url: string;
  section: string;
  tabId: string;
  tabLabel: string;
  order: number;
  /**
   * Hidden pages are still routed and prerendered — the standard keeps them
   * reachable by URL — but are excluded from the sidebar, prev/next, the
   * sitemap, and search.
   */
  hidden?: boolean;
  icon?: string;
  tag?: string;
  /** Module key of the MDX file, e.g. "/content/docs/installation.mdx". */
  filePath: string;
}

/** A routed docs page in the navigation tree. */
export interface NavPageNode {
  kind: 'page';
  page: NormalizedDocsPage;
}

/** An external link. Never routed, never in prev/next, never indexed. */
export interface NavLinkNode {
  kind: 'link';
  label: string;
  href: string;
  icon?: string;
  hidden?: boolean;
}

/** A titled, arbitrarily nestable group of nodes. */
export interface NavGroupNode {
  kind: 'group';
  label: string;
  /** Optional landing page for the group itself. */
  root?: NavPageNode;
  children: NavNode[];
  icon?: string;
  expanded?: boolean;
  hidden?: boolean;
}

export type NavNode = NavPageNode | NavLinkNode | NavGroupNode;

export interface NormalizedDocsConfig {
  name?: string;
  tabs: DocsTab[];
  /** Navigation tree per tab id. */
  navigation: Record<string, NavNode[]>;
  /** Top-level anchors, rendered above the sidebar. */
  anchors: NavLinkNode[];
  /** All routed pages in document order, including hidden ones. */
  pages: NormalizedDocsPage[];
  pageBySlug: Record<string, NormalizedDocsPage>;
  pageByLookupSlug: Record<string, NormalizedDocsPage>;
}

export interface NormalizeOptions {
  /** Route prefix for docs pages. Phases 6/7 pass "/v2/docs", "/es/docs", etc. */
  docsPrefix?: string;
}

/* ---------------------------------------------------------------------------
 * Content
 * ------------------------------------------------------------------------- */

export interface TocEntry {
  name: string;
  id: string;
  size: number;
}

export interface DocFrontmatter {
  title?: string;
  description?: string;
  noindex?: boolean;
  [key: string]: unknown;
}

export interface DocModule {
  default: (props: { components?: Record<string, unknown> }) => React.ReactElement;
  frontmatter?: DocFrontmatter;
  toc?: TocEntry[];
}
