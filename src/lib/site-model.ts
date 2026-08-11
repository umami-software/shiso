import { toAbsoluteUrl, toHref } from '@/lib/paths';
import { resolveSearchConfig } from '@/lib/search/config';
import type {
  ConfigLink,
  ContextualOption,
  ContextualOptionObject,
  DocsConfig,
  LinkTarget,
  NormalizedDocsConfig,
  NormalizedDocsPage,
  NormalizedFooter,
  NormalizedLink,
  NormalizedNavbar,
  ResolvedContextualOption,
  SiteModel,
  ThemeLabels,
} from '@/lib/types';

const SHISO_THEME_LABELS: ThemeLabels = {
  menu: 'Menu',
  documentationNavigation: 'Documentation navigation',
  sections: 'Sections',
  tableOfContents: 'On this page',
  tableOfContentsNavigation: 'Table of contents',
  searchTitle: 'Search',
  searching: 'Searching...',
  searchUnavailable: 'Search unavailable',
  noResults: 'No results',
  lastUpdated: 'Last updated on',
  notFound: 'Page not found',
  dismissBanner: 'Dismiss banner',
  toggleTheme: 'Toggle theme',
  moreOptions: 'More options',
  copied: 'Copied',
  expand: 'Expand',
  collapse: 'Collapse',
  copyPage: 'Copy page',
  copyPageDescription: 'Copy this page as Markdown',
  viewMarkdown: 'View as Markdown',
  viewMarkdownDescription: 'Open this page as plain Markdown',
  openInChatGPT: 'Open in ChatGPT',
  openInClaude: 'Open in Claude',
  openInPerplexity: 'Open in Perplexity',
  askQuestionsAboutPage: 'Ask questions about this page',
};

function isInternalHref(href: string): boolean {
  return /^(?:#|\/|\.\.?\/)/.test(href);
}

export function resolveLinkTarget(href: string, target?: LinkTarget): LinkTarget {
  return target || (isInternalHref(href) ? '_self' : '_blank');
}

function normalizeLink(link: ConfigLink): NormalizedLink {
  return {
    href: link.href,
    label: link.label?.trim() || undefined,
    ariaLabel: link.ariaLabel?.trim() || undefined,
    icon: link.icon?.trim() || undefined,
    target: resolveLinkTarget(link.href, link.target),
  };
}

function normalizeNavbar(config: DocsConfig['navbar']): NormalizedNavbar | null {
  if (!config) {
    return null;
  }

  const links = (config.links || []).filter(link => !!link?.href).map(normalizeLink);
  const primary = config.primary?.href ? normalizeLink(config.primary) : undefined;

  return links.length || primary ? { links, primary } : null;
}

function normalizeFooter(config: DocsConfig['footer']): NormalizedFooter | null {
  const socials = (config?.socials || []).filter(link => !!link?.href).map(normalizeLink);
  const links = (config?.links || [])
    .filter(column => column?.items?.length)
    .map(column => ({
      ...column,
      items: column.items.map(item => ({
        ...item,
        target: resolveLinkTarget(item.href, item.target),
      })),
    }));
  const attribution = config?.attribution !== false;

  return socials.length || links.length || attribution ? { socials, links, attribution } : null;
}

export function resolveSiteModel(config: DocsConfig, docs: NormalizedDocsConfig): SiteModel {
  const appearance = config.appearance || {};
  const logo = config.logo
    ? typeof config.logo === 'string'
      ? { light: config.logo, dark: config.logo }
      : {
          light: config.logo.light || config.logo.dark,
          dark: config.logo.dark || config.logo.light,
          href: config.logo.href,
          target: config.logo.href
            ? resolveLinkTarget(config.logo.href, config.logo.target)
            : undefined,
        }
    : null;

  return {
    name: config.name?.trim() || undefined,
    logo,
    navbar: normalizeNavbar(config.navbar),
    footer: normalizeFooter(config.footer),
    banner: config.banner?.content?.trim()
      ? { content: config.banner.content.trim(), dismissible: config.banner.dismissible === true }
      : null,
    appearance: {
      default:
        appearance.default === 'light' || appearance.default === 'dark'
          ? appearance.default
          : 'system',
      strict: appearance.strict === true,
    },
    styling: {
      eyebrows: config.styling?.eyebrows === 'breadcrumbs' ? 'breadcrumbs' : 'section',
    },
    search: resolveSearchConfig(config.search),
    contextualOptions: (config.contextual?.options || []).filter(
      option => typeof option !== 'string' || !['mcp', 'cursor', 'vscode'].includes(option),
    ),
    error404: { ...config.errors?.['404'], redirect: config.errors?.['404']?.redirect !== false },
    showTimestamp: config.metadata?.timestamp === true,
    drilldown: config.interaction?.drilldown,
    locale: config.$shiso?.locale?.trim() || 'en-US',
    labels: SHISO_THEME_LABELS,
    docs,
  };
}

function aiPrompt(mdUrl: string): string {
  return `Read ${mdUrl} so I can ask questions about it.`;
}

export function resolveContextualOptions(
  options: ContextualOption[],
  page: NormalizedDocsPage,
  labels: ThemeLabels = SHISO_THEME_LABELS,
): ResolvedContextualOption[] {
  const mdHref = `${toHref(page.url)}.md`;
  const absolutePageUrl = toAbsoluteUrl(page.url);
  const mdUrl = absolutePageUrl ? `${absolutePageUrl}.md` : undefined;
  const resolved: ResolvedContextualOption[] = [];

  for (const option of options) {
    if (typeof option !== 'string') {
      const custom = option as ContextualOptionObject;
      const href = custom.href.replaceAll('$path', page.url).replaceAll('$page', mdUrl || mdHref);

      resolved.push({
        key: custom.title,
        title: custom.title,
        description: custom.description,
        icon: custom.icon,
        action: 'link',
        href,
        target: resolveLinkTarget(href, custom.target),
      });
      continue;
    }

    if (option === 'copy') {
      resolved.push({
        key: option,
        title: labels.copyPage,
        description: labels.copyPageDescription,
        icon: 'copy',
        action: 'copy',
        href: mdHref,
        target: '_self',
      });
    } else if (option === 'view') {
      resolved.push({
        key: option,
        title: labels.viewMarkdown,
        description: labels.viewMarkdownDescription,
        icon: 'external-link',
        action: 'link',
        href: mdHref,
        target: '_blank',
      });
    } else if (mdUrl && option === 'chatgpt') {
      resolved.push({
        key: option,
        title: labels.openInChatGPT,
        description: labels.askQuestionsAboutPage,
        icon: 'external-link',
        action: 'link',
        href: `https://chatgpt.com/?q=${encodeURIComponent(aiPrompt(mdUrl))}`,
        target: '_blank',
      });
    } else if (mdUrl && option === 'claude') {
      resolved.push({
        key: option,
        title: labels.openInClaude,
        description: labels.askQuestionsAboutPage,
        icon: 'external-link',
        action: 'link',
        href: `https://claude.ai/new?q=${encodeURIComponent(aiPrompt(mdUrl))}`,
        target: '_blank',
      });
    } else if (mdUrl && option === 'perplexity') {
      resolved.push({
        key: option,
        title: labels.openInPerplexity,
        description: labels.askQuestionsAboutPage,
        icon: 'external-link',
        action: 'link',
        href: `https://www.perplexity.ai/search?q=${encodeURIComponent(aiPrompt(mdUrl))}`,
        target: '_blank',
      });
    }
  }

  return resolved;
}
