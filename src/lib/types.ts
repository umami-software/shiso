export interface PageObjectItem {
  page: string;
  title?: string;
  label?: string;
}

export type PageItem = string | GroupItem | PageObjectItem;

export interface GroupItem {
  group: string;
  root?: string;
  pages: PageItem[];
}

export interface DropdownItem {
  dropdown: string;
  groups?: GroupItem[];
  pages?: PageItem[];
}

export interface TabItem {
  tab: string;
  groups?: GroupItem[];
  pages?: PageItem[];
  dropdowns?: DropdownItem[];
}

export interface VersionItem {
  version: string;
  default?: boolean;
  tabs?: TabItem[];
  dropdowns?: DropdownItem[];
  groups?: GroupItem[];
  pages?: PageItem[];
}

export interface LanguageItem {
  language: string;
  default?: boolean;
  versions?: VersionItem[];
  tabs?: TabItem[];
  dropdowns?: DropdownItem[];
  groups?: GroupItem[];
  pages?: PageItem[];
}

export interface NavigationConfig {
  tabs?: TabItem[];
  dropdowns?: DropdownItem[];
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

export type LogoOption = string | { light?: string; dark?: string; href?: string };

export interface DocsConfig {
  $schema?: string;
  theme?: string;
  name?: string;
  colors?: ThemeColors;
  logo?: LogoOption;
  favicon?: string;
  description?: string;
  navigation: NavigationConfig;
}

export interface DocsTab {
  id: string;
  label: string;
  url: string;
}

export interface DocsPageLink {
  label: string;
  slug: string;
  url: string;
}

export interface DocsNavSection {
  section: string;
  pages: DocsPageLink[];
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
  /** Module key of the MDX file, e.g. "/content/docs/installation.mdx". */
  filePath: string;
}

export interface NormalizedDocsConfig {
  name?: string;
  tabs: DocsTab[];
  navigation: Record<string, DocsNavSection[]>;
  pages: NormalizedDocsPage[];
  pageBySlug: Record<string, NormalizedDocsPage>;
  pageByLookupSlug: Record<string, NormalizedDocsPage>;
}

export interface TocEntry {
  name: string;
  id: string;
  size: number;
}

export interface DocFrontmatter {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

export interface DocModule {
  default: (props: { components?: Record<string, unknown> }) => React.ReactElement;
  frontmatter?: DocFrontmatter;
  toc?: TocEntry[];
}
