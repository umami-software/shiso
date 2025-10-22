export type Page = string;

export interface Group {
  group: string;
  icon?: string;
  href?: string;
  pages: Page[];
}

export interface Tab {
  tab: string;
  icon?: string;
  href?: string;
  groups?: Group[];
  pages?: Page[];
}

export interface Navigation {
  pages?: Page[];
  groups?: Group[];
  tabs?: Tab[];
  top: number | string;
}

export interface Content {
  meta: Record<string, any>;
  path: string;
  code: string;
  content: string;
  anchors?: { id: string; name: string; size: number }[];
  slug?: string;
}

export interface ComponentProps<T> {
  config?: T;
  content?: Content;
  collection?: Content[];
}

export type ShisoConfig = DocsConfig | BlogConfig;

export interface DocsConfig {
  contentDir: string;
  title: string;
  navigation: Navigation;
}

export interface BlogConfig {
  contentDir: string;
  title: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  author: string;
  date: string;
  image: string;
}
