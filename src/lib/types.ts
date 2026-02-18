export interface ShisoDocsConfig {
  top?: string | number;
}

export interface ShisoBlogConfig {
  title?: string;
}

export interface ShisoConfig {
  contentDir: string;
  docsConfigPath?: string;
  docs?: ShisoDocsConfig & { [key: string]: any };
  blog?: ShisoBlogConfig & { [key: string]: any };
}

export interface ShisoContent {
  meta: { [key: string]: any };
  path: string;
  code: string;
  content: string;
  anchors?: { id: string; name: string; size: number }[];
  slug?: string;
  tabs?: DocsTab[];
  navigation?: Record<string, DocsNavSection[]>;
  section?: string;
  prev?: { label: string; url: string } | null;
  next?: { label: string; url: string } | null;
  url?: string;
  tabId?: string;
}

export interface ShisoRenderProps {
  type: string;
  content: any;
  config: ShisoConfig;
}

export type MintlifyPageItem = string | MintlifyGroupItem;

export interface MintlifyGroupItem {
  group: string;
  pages: MintlifyPageItem[];
}

export interface MintlifyTabItem {
  tab: string;
  groups?: MintlifyGroupItem[];
  pages?: MintlifyPageItem[];
}

export interface MintlifyNavigation {
  tabs?: MintlifyTabItem[];
  groups?: MintlifyGroupItem[];
  pages?: MintlifyPageItem[];
}

export interface MintlifyDocsConfig {
  $schema?: string;
  theme?: string;
  name?: string;
  navigation: MintlifyNavigation;
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
