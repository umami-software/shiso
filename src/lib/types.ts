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
  target?: LinkTarget;
}

export type PageItem = string | GroupItem | PageObjectItem | LinkItem;

export interface GroupItem {
  group: string;
  root?: string;
  pages: PageItem[];
  icon?: string;
  expanded?: boolean;
  collapsible?: boolean;
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
  /** Internal normalized presentation; not a docs.json field. */
  presentation?: 'tab' | 'dropdown';
}

export interface AnchorItem {
  anchor: string;
  href?: string;
  icon?: string;
  hidden?: boolean;
  target?: LinkTarget;
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

export type LogoOption =
  | string
  | { light?: string; dark?: string; href?: string; target?: LinkTarget };

/** Shiso-only configuration. Namespaced so docs.json stays portable. */
export interface ShisoOptions {
  /** Where docs pages are mounted within the site. Default "/docs"; "" for root. */
  docsPrefix?: string;
  /** Content directory relative to the project root. Default "content/docs". */
  contentDir?: string;
  /** Absolute site origin, required for canonical and og:url tags. */
  siteUrl?: string;
  /** Locale used for deterministic date formatting. */
  locale?: string;
}

export type LinkTarget = '_self' | '_blank';

/** A user-configured link. Presentation is determined entirely by its fields. */
export interface ConfigLink {
  /** Visible link text. Omit for an icon-only link. */
  label?: string;
  href: string;
  icon?: string;
  /** Accessible text for an icon-only link. */
  ariaLabel?: string;
  /** Override whether the link opens in the current or a new browsing context. */
  target?: LinkTarget;
}

export type NavbarLink = ConfigLink;

export type NavbarPrimary = ConfigLink;

export interface NavbarConfig {
  links?: NavbarLink[];
  primary?: NavbarPrimary;
}

export interface FooterLinkItem {
  label: string;
  href: string;
  target?: LinkTarget;
}

export interface FooterLinkColumn {
  header?: string;
  items: FooterLinkItem[];
}

export interface FooterConfig {
  socials?: ConfigLink[];
  links?: FooterLinkColumn[];
  /** Show the theme-provided Shiso attribution. Defaults to true. */
  attribution?: boolean;
}

export interface BannerConfig {
  /** Supports basic markdown: links, bold, italic, and inline code. */
  content: string;
  dismissible?: boolean;
}

/**
 * A redirect for a moved or renamed page. Sources are matched exactly;
 * wildcard patterns (`:slug*`) are recognized but not implemented.
 * `permanent` is accepted for portability — static hosting cannot vary the
 * status code, so every redirect renders as a meta refresh page.
 */
export interface RedirectRule {
  source: string;
  destination: string;
  permanent?: boolean;
}

export interface SeoConfig {
  /** Extra meta tags added to every page, e.g. { "og:image": "/social.png" }. */
  metatags?: Record<string, string>;
  /** "navigable" (default) keeps hidden pages out of the index; "all" indexes everything. */
  indexing?: 'navigable' | 'all';
}

export interface Error404Config {
  /** Navigate to the docs home instead of showing the 404 page. Defaults to true. */
  redirect?: boolean;
  title?: string;
  /** Supports basic markdown: links, bold, italic, and inline code. */
  description?: string;
}

export interface ErrorsConfig {
  '404'?: Error404Config;
}

export interface MetadataConfig {
  /** Show the last-modified date on all pages. Overridable per page via `timestamp` frontmatter. */
  timestamp?: boolean;
}

export interface AppearanceConfig {
  /** Initial theme mode. "system" follows the OS preference. */
  default?: 'system' | 'light' | 'dark';
  /** Hide the light/dark toggle and ignore stored preferences. */
  strict?: boolean;
}

export interface StylingConfig {
  /** Page eyebrow style: the section name (default) or the full breadcrumb path. */
  eyebrows?: 'section' | 'breadcrumbs';
  /** Recognized for compatibility; accepted and ignored. */
  latex?: unknown;
  codeblocks?: unknown;
}

export interface FontSpec {
  /** Font family name. Google Fonts families load automatically without a source. */
  family: string;
  weight?: number;
  /** URL or path to a hosted font file, for non-Google fonts. */
  source?: string;
  format?: 'woff' | 'woff2';
}

export interface FontsConfig extends FontSpec {
  heading?: FontSpec;
  body?: FontSpec;
}

export interface SearchConfig {
  /** Placeholder text for the search input. */
  prompt?: string;
  /** Registered provider id. Defaults to the built-in local provider. */
  provider?: string;
  /** Provider-specific configuration. */
  options?: Record<string, unknown>;
  /** Cmd/Ctrl shortcut key. Set false to disable the shortcut. Defaults to "k". */
  shortcut?: string | false;
  /** Text shown for the shortcut. The theme supplies a platform-neutral default. */
  shortcutLabel?: string;
}

export interface InteractionConfig {
  /**
   * Collapsible-group click behavior: true navigates to the group's first
   * page on expand, false only expands/collapses. Unset uses the default
   * (navigate when the group has a root page, toggle otherwise).
   */
  drilldown?: boolean;
}

/**
 * A custom contextual menu entry. `href` may contain `$path` (replaced with
 * the current page path) and `$page` (replaced with the page's markdown URL).
 */
export interface ContextualOptionObject {
  title: string;
  description?: string;
  icon?: string;
  href: string;
  target?: LinkTarget;
}

export type ContextualOption =
  | 'copy'
  | 'view'
  | 'chatgpt'
  | 'claude'
  | 'perplexity'
  | 'mcp'
  | 'cursor'
  | 'vscode'
  | ContextualOptionObject;

export interface ContextualConfig {
  options: ContextualOption[];
}

export interface BackgroundConfig {
  /** Background image, single or per-mode. */
  image?: string | { light?: string; dark?: string };
  /** Recognized for compatibility; theme decorations are accepted and ignored. */
  decoration?: string;
  /** Background color per mode. */
  color?: { light?: string; dark?: string };
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
  navbar?: NavbarConfig;
  footer?: FooterConfig;
  banner?: BannerConfig;
  redirects?: RedirectRule[];
  seo?: SeoConfig;
  errors?: ErrorsConfig;
  metadata?: MetadataConfig;
  appearance?: AppearanceConfig;
  styling?: StylingConfig;
  fonts?: FontsConfig;
  background?: BackgroundConfig;
  /** Search settings. Set to false to hide search and skip index generation. */
  search?: false | SearchConfig;
  interaction?: InteractionConfig;
  contextual?: ContextualConfig;

  /**
   * Recognized config keys that are not implemented yet. They are
   * accepted by the schema and ignored at runtime (see `scripts/validate-config.mjs`).
   * Typed `unknown` deliberately: code must not grow a dependency on them until
   * the corresponding feature lands and the key is given a real type above.
   */
  thumbnails?: unknown;
  icons?: unknown;
  api?: unknown;
  integrations?: unknown;
}

/* ---------------------------------------------------------------------------
 * Normalized shapes
 * ------------------------------------------------------------------------- */

export interface DocsTab {
  id: string;
  label: string;
  url: string;
  icon?: string;
  presentation: 'tab' | 'dropdown';
  hidden?: boolean;
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
   * Hidden pages are still routed and prerendered, so they remain reachable by
   * URL, but are excluded from the sidebar, prev/next, the
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
  target: LinkTarget;
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
  collapsible?: boolean;
  hidden?: boolean;
}

export type NavNode = NavPageNode | NavLinkNode | NavGroupNode;

export interface NormalizedDocsConfig {
  name?: string;
  tabs: DocsTab[];
  /** Whether the source config explicitly defines top-level tabs/dropdowns. */
  showTabs: boolean;
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

export interface NormalizedLink extends ConfigLink {
  target: LinkTarget;
}

export interface NormalizedNavbar {
  links: NormalizedLink[];
  primary?: NormalizedLink;
}

export interface NormalizedFooter {
  socials: NormalizedLink[];
  links: FooterLinkColumn[];
  attribution: boolean;
}

export interface ThemeLabels {
  menu: string;
  documentationNavigation: string;
  sections: string;
  tableOfContents: string;
  tableOfContentsNavigation: string;
  searchTitle: string;
  searching: string;
  searchUnavailable: string;
  noResults: string;
  lastUpdated: string;
  notFound: string;
  dismissBanner: string;
  toggleTheme: string;
  moreOptions: string;
  copied: string;
  expand: string;
  collapse: string;
  copyPage: string;
  copyPageDescription: string;
  viewMarkdown: string;
  viewMarkdownDescription: string;
  openInChatGPT: string;
  openInClaude: string;
  openInPerplexity: string;
  askQuestionsAboutPage: string;
}

export interface SiteModel {
  name?: string;
  logo: { light?: string; dark?: string; href?: string; target?: LinkTarget } | null;
  navbar: NormalizedNavbar | null;
  footer: NormalizedFooter | null;
  banner: BannerConfig | null;
  appearance: Required<AppearanceConfig>;
  styling: Required<Pick<StylingConfig, 'eyebrows'>>;
  search: import('@/lib/search/config').ResolvedSearchConfig;
  contextualOptions: ContextualOption[];
  error404: Required<Pick<Error404Config, 'redirect'>> & Error404Config;
  showTimestamp: boolean;
  drilldown?: boolean;
  locale: string;
  labels: ThemeLabels;
  docs: NormalizedDocsConfig;
}

export interface ResolvedContextualOption {
  key: string;
  title: string;
  description?: string;
  icon?: string;
  action: 'copy' | 'link';
  href: string;
  target: LinkTarget;
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
  /** Overrides the site-wide `metadata.timestamp` setting for this page. */
  timestamp?: boolean;
  [key: string]: unknown;
}

export interface DocModule {
  default: (props: { components?: Record<string, unknown> }) => React.ReactElement;
  frontmatter?: DocFrontmatter;
  toc?: TocEntry[];
}
