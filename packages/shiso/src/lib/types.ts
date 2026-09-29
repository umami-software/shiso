import type { ThemeLabels, Translations } from '../../types/labels';

export type { ThemeLabels, Translations } from '../../types/labels';

import type { PluggableList } from 'unified';

/* ---------------------------------------------------------------------------
 * Raw docs.json shapes
 * ------------------------------------------------------------------------- */

export interface PageObjectItem {
  page: string;
  title?: string;
  label?: string;
  icon?: string;
  tag?: string;
  /** HTTP method badge shown in the sidebar, set by OpenAPI navigation entries. */
  method?: string;
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

export interface GlobItem {
  glob: string;
  exclude?: string[];
}

export type PageItem = string | GroupItem | PageObjectItem | LinkItem | GlobItem;

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
  /** Link tab: navigates to this URL instead of owning docs pages. */
  href?: string;
  icon?: string;
  hidden?: boolean;
  /** Internal normalized presentation; not a docs.json field. */
  presentation?: 'tab' | 'dropdown';
}

export interface AnchorItem {
  anchor: string;
  href: string;
  icon?: string;
  hidden?: boolean;
  target?: LinkTarget;
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
  tabs?: TabItem[];
  dropdowns?: DropdownItem[];
  anchors?: AnchorItem[];
  versions?: VersionItem[];
  languages?: LanguageItem[];
  groups?: GroupItem[];
  pages?: PageItem[];
}

export interface ThemeColors {
  primary?: string;
  light?: string;
  dark?: string;
}

export type LogoOption =
  | string
  | {
      light?: string;
      dark?: string;
      href?: string;
      target?: LinkTarget;
      /** Force the logo to white in dark mode with a CSS filter instead of
       * swapping to a dark variant. Best for monochrome logos. */
      invert?: boolean;
    };

/** Project-level settings supplied by shiso.config.ts. Mirrors the public
 * shape exported from "@umami/shiso/config". */
export interface MdxConfig {
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
}

export interface ShisoConfig {
  /** Where docs pages are mounted within the site. Default "/docs"; "" for root. */
  docsPrefix?: string;
  /** Content directory relative to the project root. Default "content/docs". */
  contentDir?: string;
  /** Absolute site origin, required for canonical and og:url tags. */
  siteUrl?: string;
  /** Default locale for UI labels and date formatting. */
  locale?: string;
  /** Partial UI label overrides keyed by BCP 47 locale. */
  translations?: Translations;
  /** Build-time remark and rehype plugins. */
  mdx?: MdxConfig;
}

/** ShisoConfig after defaults and normalization, as served by `virtual:shiso-config`. */
export interface ResolvedShisoConfig {
  docsPrefix: string;
  contentDir: string;
  siteUrl?: string;
  locale: string;
  translations?: Translations;
  /** Build-only compiler hooks. Removed from the virtual browser module. */
  mdx?: MdxConfig;
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

/** A redirect for a moved or renamed page. Sources are matched exactly. */
export interface RedirectRule {
  source: string;
  destination: string;
}

/** A standalone page outside the docs navigation, e.g. a landing page. */
export interface StandalonePageItem {
  /** Route path, starting with "/". "/" replaces the root redirect to docs. */
  path: string;
  /** File slug under content/pages, e.g. "home" for content/pages/home.tsx. */
  page: string;
  /** Page title used in the document head. Frontmatter title wins. */
  title?: string;
  /**
   * Navigation language this page belongs to, e.g. "ja". Sets the document
   * language, header navigation, and language selector for the page.
   */
  language?: string;
}

/** Normalized standalone page. */
export interface StandalonePage {
  /** Base-relative route, e.g. "/" or "/about". */
  path: string;
  /** Module key of the TSX, MDX, or Markdown file. */
  filePath: string;
  /** Config-level head-title override. */
  title?: string;
  /** Navigation language the page belongs to; untagged pages use the default language. */
  language?: string;
  /**
   * Language-independent identity: the file slug without its language folder,
   * so "ja/home" (language "ja") and "home" are the same page in two languages.
   */
  key: string;
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

export interface EditLinkConfig {
  /** HTTP(S) URL template. $file is the encoded source path relative to the project root. */
  url: string;
  label?: string;
}

export interface FeedbackConfig {
  /** HTTP(S) or site-relative endpoint accepting a JSON POST. */
  endpoint: string;
  prompt?: string;
  helpfulLabel?: string;
  unhelpfulLabel?: string;
  successMessage?: string;
  errorMessage?: string;
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

export interface CodeBlockConfig {
  /** Show line numbers on every block. Override per block with `showLineNumbers` or `hideLineNumbers`. */
  lineNumbers?: boolean;
  /** Bundled Shiki theme names for each color mode. */
  theme?: {
    light?: string;
    dark?: string;
  };
}

export interface StylingConfig {
  /** Page eyebrow style: the section name (default) or the full breadcrumb path. */
  eyebrows?: 'section' | 'breadcrumbs';
  /** Fenced code block defaults. */
  codeBlocks?: CodeBlockConfig;
}

export interface ResolvedCodeBlockConfig {
  lineNumbers: boolean;
  theme: { light: string; dark: string };
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

/**
 * Named slots a theme can place the search control in. Every theme must
 * support "header"; unsupported positions fall back to it.
 */
export type SearchPosition = 'header' | 'sidebar';

export interface SearchConfig {
  /** Placeholder text for the search input. */
  prompt?: string;
  /**
   * Where the search control renders: "header" (default, right side of the
   * header) or "sidebar" (top of the navigation column).
   */
  position?: SearchPosition;
  /** Provider id: "local" (default), "pagefind", or a runtime-registered id. */
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
  | ContextualOptionObject;

export interface ContextualConfig {
  options: ContextualOption[];
}

export interface BackgroundConfig {
  /** Background image, single or per-mode. */
  image?: string | { light?: string; dark?: string };
  /** Background color per mode. */
  color?: { light?: string; dark?: string };
}

export interface DocsConfig {
  $schema?: string;
  theme?: string;
  name?: string;
  colors?: ThemeColors;
  logo?: LogoOption;
  favicon?: string;
  description?: string;
  navigation: NavigationConfig;
  /** Standalone pages outside the docs navigation, e.g. a landing page at "/". */
  pages?: StandalonePageItem[];
  navbar?: NavbarConfig;
  footer?: FooterConfig;
  banner?: BannerConfig;
  redirects?: RedirectRule[];
  seo?: SeoConfig;
  errors?: ErrorsConfig;
  metadata?: MetadataConfig;
  editLink?: false | EditLinkConfig;
  feedback?: false | FeedbackConfig;
  appearance?: AppearanceConfig;
  styling?: StylingConfig;
  fonts?: FontsConfig;
  background?: BackgroundConfig;
  /** Search settings. Set to false to hide search and skip index generation. */
  search?: false | SearchConfig;
  interaction?: InteractionConfig;
  contextual?: ContextualConfig;
  /** API reference settings: the OpenAPI spec powering `openapi:` frontmatter pages. */
  api?: ApiConfig;
}

export type ApiPlaygroundDisplay = 'interactive' | 'simple' | 'none';

export interface ApiPlaygroundConfig {
  /**
   * "interactive" (default) renders the "Try it" panel on endpoint pages;
   * "simple" and "none" show the reference without it.
   */
  display?: ApiPlaygroundDisplay;
  /**
   * URL of a CORS proxy the playground sends requests through. `$url` in the
   * value is replaced with the encoded target URL; without it the target URL
   * is appended. Requests go directly to the API when omitted.
   */
  proxy?: string;
}

export interface ApiConfig {
  /**
   * One OpenAPI 3.x spec (JSON or YAML) or a list of them: paths relative to
   * the project root, or https URLs fetched at build time.
   */
  spec: string | string[];
  /** Folder inside the content directory for generated endpoint pages. Default "api-reference". */
  directory?: string;
  /** "Try it" panel settings for endpoint pages. */
  playground?: ApiPlaygroundConfig;
}

/** Playground settings after defaults, as carried on the site model. */
export interface ResolvedApiPlayground {
  display: ApiPlaygroundDisplay;
  proxy?: string;
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
  /** True for link tabs configured with `href` instead of docs pages. */
  link?: boolean;
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
  /** Id of the navigation scope (version/language) this page belongs to. */
  scopeId: string;
  /** Language label of the owning scope, when the site defines languages. */
  language?: string;
  /** Version label of the owning scope, when the site defines versions. */
  version?: string;
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
  /** HTTP method badge for API reference pages. */
  method?: string;
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
  /** Route prefix for docs pages. Default "/docs"; "" serves docs at the root. */
  docsPrefix?: string;
}

/**
 * One navigation scope of a site: the ordinary navigation, a version, a
 * language, or a version nested inside a language. Page references alone
 * determine URLs; scopes never add their own URL prefixes.
 */
export interface DocsScope {
  id: string;
  /** Language label, when this scope belongs to a language. */
  language?: string;
  /** Version label, when this scope belongs to a version. */
  version?: string;
  /** Hidden scopes still build, but are omitted from switchers. */
  hidden?: boolean;
  isDefault: boolean;
  /** Landing scope of its language: the language's default version. */
  isLanguageDefault: boolean;
  /** URL of the scope's first visible page — the landing page for switchers. */
  firstPageUrl: string;
  docs: NormalizedDocsConfig;
}

/** The complete normalized site: every scope, with global page lookups. */
export interface NormalizedDocsSite {
  scopes: DocsScope[];
  defaultScopeId: string;
  /** Every routed page across all scopes, in scope order. */
  pages: NormalizedDocsPage[];
  /** Exact canonical URL to page, across all scopes. */
  pageByUrl: Record<string, NormalizedDocsPage>;
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

export interface SiteModel {
  name?: string;
  logo: {
    light?: string;
    dark?: string;
    href?: string;
    target?: LinkTarget;
    invert?: boolean;
  } | null;
  navbar: NormalizedNavbar | null;
  footer: NormalizedFooter | null;
  banner: BannerConfig | null;
  appearance: Required<AppearanceConfig>;
  styling: {
    eyebrows: 'section' | 'breadcrumbs';
    codeBlocks: ResolvedCodeBlockConfig;
  };
  search: import('@/lib/search/config').ResolvedSearchConfig;
  contextualOptions: ContextualOption[];
  error404: Required<Pick<Error404Config, 'redirect'>> & Error404Config;
  showTimestamp: boolean;
  editLink?: EditLinkConfig | null;
  feedback?: FeedbackConfig | null;
  drilldown?: boolean;
  locale: string;
  labels: ThemeLabels;
  api: { playground: ResolvedApiPlayground };
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

/** A related-topics entry: a page path, or a link with an explicit title. */
export type RelatedEntry = string | { href: string; title?: string };

export interface DocFrontmatter {
  /** Override the edit URL, or hide the edit link on this page. */
  editLink?: string | false;
  /** Hide the feedback controls on this page. */
  feedback?: false;
  title?: string;
  description?: string;
  noindex?: boolean;
  /** Hide the search control and disable its shortcut on this page. */
  search?: false;
  /** Overrides the site-wide `metadata.timestamp` setting for this page. */
  timestamp?: boolean;
  /** Related pages rendered above the prev/next pager. */
  related?: RelatedEntry[];
  /**
   * Binds the page to an API operation, e.g. "GET /users/{id}", a webhook
   * ("webhook userCreated"), or a spec-qualified key on multi-spec sites
   * ("users.yaml GET /users").
   */
  openapi?: string;
  /** Binds the page to a named component schema, e.g. "User" or "users.yaml User". */
  'openapi-schema'?: string;
  /** Overrides `api.playground.display` for this page. */
  playground?: ApiPlaygroundDisplay;
  [key: string]: unknown;
}

export interface DocModule {
  default: (props: { components?: Record<string, unknown> }) => React.ReactElement;
  frontmatter?: DocFrontmatter;
  toc?: TocEntry[];
}

/* ---------------------------------------------------------------------------
 * OpenAPI reference shapes (produced by scripts/lib/openapi.mjs)
 * ------------------------------------------------------------------------- */

export interface SchemaNode {
  name?: string;
  /** Display label such as "string", "User[]", "enum<string>", or "oneOf". */
  type: string;
  required?: boolean;
  deprecated?: boolean;
  description?: string;
  default?: string;
  enum?: string[];
  /** Example value (stringified) for parameters, used by samples and the playground. */
  example?: string;
  children?: SchemaNode[];
}

/** A security scheme an operation accepts, resolved from components.securitySchemes. */
export interface SecurityScheme {
  /** Scheme key in the spec, e.g. "bearerAuth". */
  name: string;
  type: 'http' | 'apiKey' | 'oauth2' | 'openIdConnect' | 'unknown';
  /** HTTP authentication scheme, lowercased: "bearer", "basic", ... */
  scheme?: string;
  /** Where an API key is sent. */
  in?: 'header' | 'query' | 'cookie';
  /** Header, query, or cookie name carrying an API key. */
  paramName?: string;
  description?: string;
  /** Display label, e.g. "bearerAuth (http bearer)". */
  label: string;
}

export interface ApiServer {
  url: string;
  description?: string;
}

export interface OpenApiSample {
  language: string;
  label: string;
  source: string;
  /** Shiki-highlighted markup generated at build time. */
  html?: string;
  lineCount?: number;
}

export interface OpenApiResponse {
  status: string;
  description?: string;
  contentType?: string;
  schema?: SchemaNode;
  example?: string;
  exampleHtml?: string;
}

export interface NormalizedOperation {
  id: string;
  /** Frontmatter lookup key, e.g. "GET /users/{id}" or "WEBHOOK userCreated". */
  key: string;
  /** The configured spec (path or URL) this operation came from. */
  spec?: string;
  /** True for OpenAPI `webhooks` entries: payloads the API sends to subscribers. */
  webhook?: boolean;
  /** Content folder of the endpoint page, relative to the content directory. */
  directory?: string;
  /** Navigation page reference of the endpoint page, e.g. "api-reference/get-user". */
  pageRef?: string;
  method: string;
  /** URL path, or the webhook name for webhooks. */
  path: string;
  summary?: string;
  description?: string;
  tags: string[];
  deprecated?: boolean;
  parameters: {
    query: SchemaNode[];
    path: SchemaNode[];
    header: SchemaNode[];
    cookie: SchemaNode[];
  };
  requestBody?: {
    required?: boolean;
    contentType: string;
    schema: SchemaNode;
    example?: string;
    exampleHtml?: string;
  };
  responses: OpenApiResponse[];
  security: SecurityScheme[];
  /** Servers the operation can be sent to, most specific level first. */
  servers: ApiServer[];
  /** URL of the first server; kept for consumers that need a single origin. */
  serverUrl: string;
  samples: OpenApiSample[];
}

/** A named component schema rendered by an `openapi-schema:` page. */
export interface SchemaPage {
  name: string;
  /** Frontmatter lookup key: the schema name. */
  key: string;
  spec?: string;
  title?: string;
  description?: string;
  schema: SchemaNode;
  example?: string;
  exampleHtml?: string;
}
