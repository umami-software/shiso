export interface ShisoDocsConfig {
  tabs?: [];
}

export interface ShisoBlogConfig {}

export interface ShisoConfig {
  contentDir: string;
  docs?: { [key: string]: any };
  blog?: { [key: string]: any };
}
