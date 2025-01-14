export interface ShisoDocsConfig {
  tabs?: [];
}

export interface ShisoBlogConfig {
  title?: string;
}

export interface ShisoConfig {
  contentDir: string;
  docs?: { [key: string]: any };
  blog?: { [key: string]: any };
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
