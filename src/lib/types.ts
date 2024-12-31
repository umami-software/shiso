export interface ShisoDocsConfig {
  tabs?: [];
}

export interface ShisoBlogConfig {}

export interface ShisoConfig {
  contentDir: string;
  docs?: { [key: string]: any };
  blog?: { [key: string]: any };
}

export interface ShisoContent {
  meta: { [key: string]: any };
  path: string;
  code: string;
  anchors?: { id: string; name: string; size: number }[];
}
