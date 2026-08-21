/**
 * Public types for shiso.config.ts. Kept self-contained (no imports) so the
 * config file typechecks in consuming projects without pulling in the runtime.
 */

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
}

/** Identity helper that types a shiso.config.ts default export. */
export declare function defineConfig(config: ShisoConfig): ShisoConfig;
