import { resolveDocFile } from '@/lib/content';
import { assertDocsConfig, normalizeDocsConfig } from '@/lib/docs-config';
import { stripBase, stripDocsPrefix } from '@/lib/paths';
import type {
  AppearanceConfig,
  BannerConfig,
  ContextualOption,
  DocsConfig,
  DocsTab,
  Error404Config,
  FooterConfig,
  NavbarConfig,
  NormalizedDocsConfig,
  NormalizedDocsPage,
  RedirectRule,
  SeoConfig,
  StylingConfig,
} from '@/lib/types';
import rawConfig from '../../docs.json';

assertDocsConfig(rawConfig, 'docs.json');

export const siteConfig: DocsConfig = rawConfig;

export const docsConfig: NormalizedDocsConfig = normalizeDocsConfig(siteConfig, resolveDocFile);

export const siteName = siteConfig.name || 'Shiso';

export interface LogoConfig {
  light?: string;
  dark?: string;
  href?: string;
}

export function getLogo(): LogoConfig | null {
  const { logo } = siteConfig;

  if (!logo) {
    return null;
  }

  if (typeof logo === 'string') {
    return { light: logo, dark: logo };
  }

  return { light: logo.light || logo.dark, dark: logo.dark || logo.light, href: logo.href };
}

/** Navbar links and primary button. Schema validation guarantees the shape. */
export function getNavbar(): NavbarConfig | null {
  const { navbar } = siteConfig;

  if (!navbar || (!navbar.links?.length && !navbar.primary)) {
    return null;
  }

  return {
    links: (navbar.links || []).filter(link => !!link?.href),
    primary: navbar.primary?.href ? navbar.primary : undefined,
  };
}

/** Footer socials and link columns. */
export function getFooter(): FooterConfig | null {
  const { footer } = siteConfig;

  if (!footer) {
    return null;
  }

  const socials = Object.entries(footer.socials || {}).filter(([, url]) => !!url);
  const links = (footer.links || []).filter(column => column?.items?.length);

  if (!socials.length && !links.length) {
    return null;
  }

  return { socials: Object.fromEntries(socials), links };
}

/** Site-wide banner. Returns null when there is no content to show. */
export function getBanner(): BannerConfig | null {
  const { banner } = siteConfig;

  if (!banner?.content?.trim()) {
    return null;
  }

  return { content: banner.content.trim(), dismissible: banner.dismissible === true };
}

/** Trailing-slash-insensitive route key for redirect matching. */
function toRouteKey(routePath: string): string {
  const trimmed = routePath.replace(/\/+$/, '');
  return trimmed || '/';
}

/**
 * Redirect rules with exact-match sources. Wildcard patterns are part of the
 * standard but not implemented; they are skipped with a warning.
 */
export function getRedirects(): RedirectRule[] {
  return (siteConfig.redirects || []).filter(rule => {
    if (!rule?.source || !rule.destination) {
      return false;
    }

    if (/[:*]/.test(rule.source)) {
      console.warn(
        `[shiso] Redirect source "${rule.source}" uses a wildcard pattern, which is not ` +
          'implemented yet — it will be skipped.',
      );
      return false;
    }

    return true;
  });
}

const redirectBySource = new Map(
  getRedirects().map(rule => [toRouteKey(rule.source), rule.destination]),
);

/** Destination for a base-relative route covered by a redirect rule, if any. */
export function matchRedirect(routePath: string): string | null {
  return redirectBySource.get(toRouteKey(routePath)) || null;
}

export function getSeo(): SeoConfig {
  const seo = siteConfig.seo || {};

  return {
    metatags: seo.metatags || {},
    indexing: seo.indexing === 'all' ? 'all' : 'navigable',
  };
}

/** 404 behavior. The standard defaults `redirect` to true (navigate home). */
export function getError404(): Required<Pick<Error404Config, 'redirect'>> & Error404Config {
  const config = siteConfig.errors?.['404'] || {};

  return { ...config, redirect: config.redirect !== false };
}

/** Theme mode defaults. The init script in index.html applies `default` and `strict`. */
export function getAppearance(): Required<AppearanceConfig> {
  const appearance = siteConfig.appearance || {};

  return {
    default:
      appearance.default === 'light' || appearance.default === 'dark'
        ? appearance.default
        : 'system',
    strict: appearance.strict === true,
  };
}

export function getStyling(): { eyebrows: 'section' | 'breadcrumbs' } {
  const styling: StylingConfig = siteConfig.styling || {};

  return { eyebrows: styling.eyebrows === 'breadcrumbs' ? 'breadcrumbs' : 'section' };
}

export function getSearchPrompt(): string {
  return siteConfig.search?.prompt?.trim() || 'Search...';
}

/** Collapsible-group click behavior. Undefined means "use the default". */
export function getDrilldown(): boolean | undefined {
  return siteConfig.interaction?.drilldown;
}

/**
 * Contextual menu options the static build can serve. The MCP-based options
 * (`mcp`, `cursor`, `vscode`) require a hosted MCP server, which Shiso does
 * not provide; they are reported once and skipped.
 */
const UNSUPPORTED_CONTEXTUAL = new Set(['mcp', 'cursor', 'vscode']);
let warnedContextual = false;

export function getContextualOptions(): ContextualOption[] {
  const options = siteConfig.contextual?.options || [];
  const skipped = options.filter(
    option => typeof option === 'string' && UNSUPPORTED_CONTEXTUAL.has(option),
  );

  if (skipped.length && !warnedContextual) {
    warnedContextual = true;
    console.warn(
      `[shiso] Contextual options ${skipped.map(option => `"${option}"`).join(', ')} require a ` +
        'hosted MCP server and are not implemented — they will be skipped.',
    );
  }

  return options.filter(
    option => typeof option !== 'string' || !UNSUPPORTED_CONTEXTUAL.has(option),
  );
}

/** True when the last-modified timestamp should show for a page. */
export function showTimestamp(frontmatterValue: unknown): boolean {
  if (typeof frontmatterValue === 'boolean') {
    return frontmatterValue;
  }

  return siteConfig.metadata?.timestamp === true;
}

export function normalizeParamSlug(slug: string): string {
  const cleaned = slug.replace(/^\/+|\/+$/g, '');

  if (!cleaned) {
    return 'index';
  }

  if (cleaned === 'index') {
    return cleaned;
  }

  return cleaned.replace(/\/index$/, '') || 'index';
}

export function getPageByPathname(pathname: string): NormalizedDocsPage | null {
  const slug = normalizeParamSlug(stripDocsPrefix(stripBase(pathname)));
  return docsConfig.pageByLookupSlug[slug] || null;
}

/** Resolves tab ownership from the normalized page before falling back to URL prefixes. */
export function getTabByPathname(pathname: string): DocsTab | undefined {
  const page = getPageByPathname(pathname);

  if (page) {
    return docsConfig.tabs.find(tab => tab.id === page.tabId);
  }

  return [...docsConfig.tabs]
    .sort((a, b) => b.url.length - a.url.length)
    .find(({ url }) => pathname === url || pathname.startsWith(`${url}/`));
}

export interface PageNavLink {
  label: string;
  url: string;
}

/** Hidden pages are routable but stay out of the pager. */
const pagerPages = docsConfig.pages.filter(page => !page.hidden);

export function getPrevNext(slug: string): {
  prev: PageNavLink | null;
  next: PageNavLink | null;
} {
  const pages = pagerPages;
  const index = pages.findIndex(page => page.slug === slug);
  const prev = index > 0 ? pages[index - 1] : null;
  const next = index >= 0 && index < pages.length - 1 ? pages[index + 1] : null;

  return {
    prev: prev ? { label: prev.label, url: prev.url } : null,
    next: next ? { label: next.label, url: next.url } : null,
  };
}

export function getPageTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} – ${siteName}` : siteName;
}
