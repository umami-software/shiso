export type Page = string;

export interface Group {
  group: string;
  icon?: string;
  href?: string;
  pages: Page[];
  menu?: any[];
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
  top?: number | string;
}

export interface Content {
  file: string;
  meta: Record<string, any>;
  path: string;
  code: string;
  content: string;
  anchors?: { id: string; name: string; size: number }[];
  slug: string;
}

export interface ComponentProps<T> {
  config?: T;
  content?: Content;
  collection?: Content[];
  mdxFiles?: Content[];
}

export interface ShisoConfig {
  contentDir: string;
  docs: DocsConfig;
  blog: BlogConfig;
}

export interface DocsConfig {
  title: string;
  navigation: Navigation;
}

export interface DocsMetadata {
  title: string;
  description: string;
}

export interface BlogConfig {
  title: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  author: string;
  date: string;
  image: string;
}
