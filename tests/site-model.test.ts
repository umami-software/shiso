import { describe, expect, it } from 'vitest';
import { resolveContextualOptions, resolveSiteModel } from '@/lib/site-model';
import type { DocsConfig, NormalizedDocsConfig, NormalizedDocsPage } from '@/lib/types';

const docs: NormalizedDocsConfig = {
  tabs: [],
  showTabs: false,
  navigation: {},
  anchors: [],
  pages: [],
  pageBySlug: {},
  pageByLookupSlug: {},
};

describe('site model', () => {
  it('defaults footer attribution to true without inventing a site name', () => {
    const site = resolveSiteModel({ navigation: { pages: ['index'] } }, docs);

    expect(site.name).toBeUndefined();
    expect(site.footer).toEqual({ socials: [], links: [], attribution: true });
  });

  it('removes an otherwise empty footer when attribution is false', () => {
    const site = resolveSiteModel(
      { navigation: { pages: ['index'] }, footer: { attribution: false } },
      docs,
    );

    expect(site.footer).toBeNull();
  });

  it('applies docs.json locale while keeping interface labels theme-owned', () => {
    const site = resolveSiteModel(
      {
        $shiso: { locale: 'fr-FR' },
        navigation: { pages: ['index'] },
      },
      docs,
    );

    expect(site.locale).toBe('fr-FR');
    expect(site.labels.tableOfContents).toBe('On this page');
    expect(site.labels.noResults).toBe('No results');
  });

  it('normalizes generic navbar link configuration', () => {
    const config: DocsConfig = {
      navigation: { pages: ['index'] },
      navbar: {
        links: [{ icon: 'github', ariaLabel: 'GitHub', href: 'https://github.com/example' }],
        primary: { label: 'Start', icon: 'rocket', href: '/start', target: '_self' },
      },
    };
    const site = resolveSiteModel(config, docs);

    expect(site.navbar).toEqual({
      links: [
        {
          href: 'https://github.com/example',
          label: undefined,
          ariaLabel: 'GitHub',
          icon: 'github',
          target: '_blank',
        },
      ],
      primary: {
        href: '/start',
        label: 'Start',
        ariaLabel: undefined,
        icon: 'rocket',
        target: '_self',
      },
    });
  });

  it('keeps footer attribution explicit and supports arbitrary social links', () => {
    const site = resolveSiteModel(
      {
        navigation: { pages: ['index'] },
        footer: {
          socials: [
            { icon: 'music', ariaLabel: 'Music', href: 'https://music.example' },
            { label: 'Status', href: '/status' },
          ],
          attribution: true,
        },
      },
      docs,
    );

    expect(site.footer?.socials.map(link => [link.icon, link.label, link.target])).toEqual([
      ['music', undefined, '_blank'],
      [undefined, 'Status', '_self'],
    ]);
    expect(site.footer?.attribution).toBe(true);
  });
});

describe('contextual actions', () => {
  it('preserves a custom icon and link target', () => {
    const page = {
      slug: 'guide',
      fileSlug: 'guide',
      label: 'Guide',
      url: '/docs/guide',
      section: 'Guides',
      tabId: 'docs',
      tabLabel: 'Docs',
      order: 0,
      filePath: '/content/docs/guide.mdx',
    } satisfies NormalizedDocsPage;

    expect(
      resolveContextualOptions(
        [
          {
            title: 'Ask support',
            icon: 'life-buoy',
            href: '/support?source=$path',
            target: '_self',
          },
        ],
        page,
      ),
    ).toEqual([
      {
        key: 'Ask support',
        title: 'Ask support',
        description: undefined,
        icon: 'life-buoy',
        action: 'link',
        href: '/support?source=/docs/guide',
        target: '_self',
      },
    ]);
  });
});
