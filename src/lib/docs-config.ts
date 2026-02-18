import fs from 'node:fs/promises';
import path from 'node:path';
import type {
  MintlifyDocsConfig,
  MintlifyPageItem,
  MintlifyTabItem,
  NormalizedDocsConfig,
  NormalizedDocsPage,
  ShisoConfig,
} from '@/lib/types';

const DEFAULT_DOCS_CONFIG_PATH = 'docs.json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function assertMintlifyDocsConfig(
  value: unknown,
  filePath: string,
): asserts value is MintlifyDocsConfig {
  if (!isRecord(value)) {
    throw new Error(`Invalid docs config at "${filePath}": expected a JSON object.`);
  }

  // Common mistake: using the Mintlify JSON schema document itself, not a project docs.json config.
  if ('anyOf' in value && 'definitions' in value && !('navigation' in value)) {
    throw new Error(
      `Invalid docs config at "${filePath}": this looks like the Mintlify schema, not a project docs.json file.`,
    );
  }

  if (!isRecord(value.navigation)) {
    throw new Error(`Invalid docs config at "${filePath}": missing "navigation" object.`);
  }
}

export async function loadDocsConfig(config: ShisoConfig): Promise<MintlifyDocsConfig> {
  const configPath = path.resolve(config.docsConfigPath || DEFAULT_DOCS_CONFIG_PATH);
  const raw = await fs.readFile(configPath, 'utf8');

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Invalid docs config at "${configPath}": failed to parse JSON. ${
        error instanceof Error ? error.message : ''
      }`.trim(),
    );
  }

  assertMintlifyDocsConfig(parsed, configPath);

  return parsed;
}

function slugifyId(value: string, fallback: string): string {
  const id = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return id || fallback;
}

function toLabel(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map(word => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');
}

function normalizePageReference(pageRef: string): { fileSlug: string; slug: string } {
  const value = pageRef
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^docs\//, '')
    .replace(/\.mdx?$/, '')
    .replace(/\/+$/, '');

  if (!value) {
    return { fileSlug: 'index', slug: 'index' };
  }

  const fileSlug = value;
  const slug = value === 'index' ? 'index' : value.replace(/\/index$/, '') || 'index';

  return { fileSlug, slug };
}

function getDefaultLabel(fileSlug: string): string {
  if (fileSlug === 'index') {
    return 'Overview';
  }

  const parts = fileSlug.split('/').filter(Boolean);
  const leaf = parts.at(-1) === 'index' ? parts.at(-2) || 'overview' : parts.at(-1) || fileSlug;
  return toLabel(leaf);
}

function pageToUrl(slug: string): string {
  return slug === 'index' ? '/docs' : `/docs/${slug}`;
}

function getTabs(config: MintlifyDocsConfig): MintlifyTabItem[] {
  const { navigation } = config;

  if (Array.isArray(navigation.tabs) && navigation.tabs.length) {
    return navigation.tabs;
  }

  if (Array.isArray(navigation.groups) || Array.isArray(navigation.pages)) {
    return [
      {
        tab: 'Documentation',
        groups: navigation.groups || [],
        pages: navigation.pages || [],
      },
    ];
  }

  throw new Error('Invalid docs config: navigation must define tabs, groups, or pages.');
}

async function resolveDocFile(contentDir: string, fileSlug: string): Promise<string> {
  const docsDir = path.resolve(contentDir, 'docs');
  const candidates = [path.join(docsDir, `${fileSlug}.mdx`), path.join(docsDir, `${fileSlug}.md`)];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Continue searching possible file extensions.
    }
  }

  throw new Error(`Missing docs page file for "${fileSlug}" under "${docsDir}".`);
}

interface PendingPage {
  fileSlug: string;
  slug: string;
  label: string;
  section: string;
  tabId: string;
  tabLabel: string;
  order: number;
}

function collectPages(
  items: MintlifyPageItem[],
  context: { tabId: string; tabLabel: string; section: string },
  pages: PendingPage[],
  orderRef: { value: number },
) {
  items.forEach(item => {
    if (typeof item === 'string') {
      const { fileSlug, slug } = normalizePageReference(item);

      pages.push({
        fileSlug,
        slug,
        label: getDefaultLabel(fileSlug),
        section: context.section,
        tabId: context.tabId,
        tabLabel: context.tabLabel,
        order: orderRef.value++,
      });
      return;
    }

    if (
      item &&
      typeof item === 'object' &&
      'group' in item &&
      typeof item.group === 'string' &&
      Array.isArray(item.pages)
    ) {
      collectPages(
        item.pages,
        { ...context, section: item.group.trim() || context.section },
        pages,
        orderRef,
      );
      return;
    }

    throw new Error('Invalid docs config: page items must be string paths or { group, pages } blocks.');
  });
}

export async function normalizeDocsConfig(
  config: ShisoConfig,
  docsConfig: MintlifyDocsConfig,
): Promise<NormalizedDocsConfig> {
  const tabs = getTabs(docsConfig);
  const pending: PendingPage[] = [];
  const orderRef = { value: 0 };

  tabs.forEach((tab, index) => {
    const tabLabel = tab.tab?.trim();

    if (!tabLabel) {
      throw new Error(`Invalid docs config: tab at index ${index} is missing "tab".`);
    }

    const tabId = slugifyId(tabLabel, `tab-${index + 1}`);

    if (Array.isArray(tab.groups)) {
      tab.groups.forEach(group => {
        if (!group?.group || !Array.isArray(group.pages)) {
          throw new Error(`Invalid docs config: tab "${tabLabel}" has an invalid group entry.`);
        }

        collectPages(
          group.pages,
          { tabId, tabLabel, section: group.group.trim() || tabLabel },
          pending,
          orderRef,
        );
      });
    }

    if (Array.isArray(tab.pages) && tab.pages.length) {
      collectPages(tab.pages, { tabId, tabLabel, section: tabLabel }, pending, orderRef);
    }
  });

  if (!pending.length) {
    throw new Error('Invalid docs config: no pages found in navigation.');
  }

  const seenFileSlugs = new Set<string>();
  const pageBySlug: Record<string, NormalizedDocsPage> = {};
  const pageByLookupSlug: Record<string, NormalizedDocsPage> = {};
  const navigation: NormalizedDocsConfig['navigation'] = {};
  const pages: NormalizedDocsPage[] = [];

  for (const page of pending) {
    if (seenFileSlugs.has(page.fileSlug)) {
      throw new Error(`Invalid docs config: duplicate page reference "${page.fileSlug}".`);
    }

    if (pageBySlug[page.slug]) {
      throw new Error(`Invalid docs config: duplicate route slug "${page.slug}".`);
    }

    seenFileSlugs.add(page.fileSlug);

    const filePath = await resolveDocFile(config.contentDir, page.fileSlug);
    const normalized: NormalizedDocsPage = {
      ...page,
      url: pageToUrl(page.slug),
      filePath,
    };

    pages.push(normalized);
    pageBySlug[normalized.slug] = normalized;
    pageByLookupSlug[normalized.slug] = normalized;
    pageByLookupSlug[normalized.fileSlug] = normalized;
    pageByLookupSlug[normalized.fileSlug.replace(/\/index$/, '') || 'index'] = normalized;

    const tabSections = (navigation[normalized.tabId] ||= []);
    let section = tabSections.find(item => item.section === normalized.section);

    if (!section) {
      section = { section: normalized.section, pages: [] };
      tabSections.push(section);
    }

    section.pages.push({
      label: normalized.label,
      slug: normalized.slug,
      url: normalized.url,
    });
  }

  const normalizedTabs = tabs.map((tab, index) => {
    const tabLabel = tab.tab?.trim() || `Tab ${index + 1}`;
    const tabId = slugifyId(tabLabel, `tab-${index + 1}`);
    const firstPage = pages.find(page => page.tabId === tabId);

    return {
      id: tabId,
      label: tabLabel,
      url: firstPage?.url || '/docs',
    };
  });

  return {
    name: docsConfig.name,
    tabs: normalizedTabs,
    navigation,
    pages,
    pageBySlug,
    pageByLookupSlug,
  };
}

export async function loadNormalizedDocsConfig(config: ShisoConfig): Promise<NormalizedDocsConfig> {
  const docsConfig = await loadDocsConfig(config);
  return normalizeDocsConfig(config, docsConfig);
}
