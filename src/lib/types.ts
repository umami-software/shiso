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
