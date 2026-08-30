import type { PluggableList } from 'unified';

/** Build-time Markdown and MDX compiler extensions. */
export interface MdxConfig {
  /** Unified remark plugins, run before Shiso's code-title and table-of-contents transforms. */
  remarkPlugins?: PluggableList;
  /** Unified rehype plugins, run before Shiso's highlighting, image, and heading transforms. */
  rehypePlugins?: PluggableList;
}

/** Project-level settings supplied by shiso.config.ts. All fields are optional. */
export interface ShisoConfig {
  /** Route prefix for docs pages within the site. Default "/docs"; "" serves docs at the site root. */
  docsPrefix?: string;
  /** Content directory relative to the project root. Default "content/docs". */
  contentDir?: string;
  /** Absolute site origin (e.g. "https://docs.example.com") used for canonical URLs, og:url, and the sitemap. */
  siteUrl?: string;
  /** Locale used for deterministic date formatting. Default "en-US". */
  locale?: string;
  /** Build-time remark and rehype plugins for Markdown and MDX content. */
  mdx?: MdxConfig;
}

/** Identity helper that types a shiso.config.ts default export. */
export declare function defineConfig(config: ShisoConfig): ShisoConfig;
