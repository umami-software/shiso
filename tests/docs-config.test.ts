import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flattenNav, isNodeHidden, normalizeDocsConfig } from '@/lib/docs-config';
import type { DocsConfig, NavGroupNode, NavLinkNode, NavPageNode } from '@/lib/types';

/** Pretends every referenced page exists, so tests exercise the parser only. */
const resolveAll = (fileSlug: string) => `/content/docs/${fileSlug}.mdx`;

function normalize(navigation: DocsConfig['navigation']) {
  return normalizeDocsConfig({ navigation } as DocsConfig, resolveAll, { docsPrefix: '/docs' });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('page items', () => {
  it('accepts strings, page objects, and label overrides', () => {
    const config = normalize({
      pages: [
        'index',
        { page: 'alpha', title: 'From title' },
        { page: 'beta', label: 'From label' },
      ],
    });

    expect(config.pages.map(page => [page.slug, page.label, page.url])).toEqual([
      ['index', 'Index', '/docs'],
      ['alpha', 'From title', '/docs/alpha'],
      ['beta', 'From label', '/docs/beta'],
    ]);
  });

  it('honors the docsPrefix option instead of a hardcoded /docs', () => {
    const config = normalizeDocsConfig(
      { navigation: { pages: ['index', 'alpha'] } } as DocsConfig,
      resolveAll,
      { docsPrefix: '/v2/docs' },
    );

    expect(config.pages.map(page => page.url)).toEqual(['/v2/docs', '/v2/docs/alpha']);
  });

  it('serves pages at the site root when docsPrefix is empty', () => {
    const config = normalizeDocsConfig(
      { navigation: { pages: ['index', 'alpha'] } } as DocsConfig,
      resolveAll,
      { docsPrefix: '' },
    );

    expect(config.pages.map(page => page.url)).toEqual(['/', '/alpha']);
  });

  it('keeps the synthetic container internal for simple navigation', () => {
    const config = normalize({ groups: [{ group: 'Start', pages: ['index'] }] });

    expect(config.showTabs).toBe(false);
    expect(config.tabs[0].label).toBe('');
    expect(config.pages[0].section).toBe('Start');
  });

  it('preserves dropdown presentation instead of turning it into a tab', () => {
    const config = normalize({ dropdowns: [{ dropdown: 'Guides', pages: ['index'] }] });

    expect(config.showTabs).toBe(true);
    expect(config.tabs[0]).toMatchObject({ label: 'Guides', presentation: 'dropdown' });
  });
});

describe('external links', () => {
  it('parses { href } into a link node', () => {
    const nodes = normalize({ pages: ['index', { href: 'https://example.com', label: 'Site' }] })
      .navigation.documentation;

    expect(nodes[1]).toEqual({
      kind: 'link',
      label: 'Site',
      href: 'https://example.com',
      icon: undefined,
      hidden: undefined,
      target: '_blank',
    });
  });

  it('accepts anchor as a label alias and rejects unlabeled links', () => {
    const nodes = normalize({
      pages: ['index', { href: 'https://a.example', anchor: 'Anchored' }],
    }).navigation.documentation as NavLinkNode[];

    expect(nodes[1].label).toBe('Anchored');
    expect(() => normalize({ pages: ['index', { href: 'https://b.example' }] })).toThrow(
      /missing a label/,
    );
  });

  it('keeps links out of the routed page list', () => {
    const config = normalize({
      pages: ['index', { href: 'https://example.com', label: 'Example' }],
    });

    expect(config.pages).toHaveLength(1);
    expect(flattenNav(config.navigation.documentation)).toHaveLength(1);
  });
});

describe('hidden items', () => {
  it('routes hidden pages but marks them hidden', () => {
    const config = normalize({ pages: ['index', { page: 'secret', hidden: true }] });
    const secret = config.pages.find(page => page.slug === 'secret');

    expect(secret?.hidden).toBe(true);
    expect(secret?.url).toBe('/docs/secret');
  });

  it('propagates a hidden group to its descendants', () => {
    const config = normalize({
      pages: [
        'index',
        { group: 'Internal', hidden: true, pages: ['internal/one', 'internal/two'] },
      ],
    });

    expect(config.pages.filter(page => page.hidden).map(page => page.slug)).toEqual([
      'internal/one',
      'internal/two',
    ]);
    expect(isNodeHidden(config.navigation.documentation[1])).toBe(true);
  });

  it('skips hidden pages when picking a tab landing page', () => {
    const config = normalize({ pages: [{ page: 'index', hidden: true }, 'visible'] });

    expect(config.tabs[0].url).toBe('/docs/visible');
  });
});

describe('nesting', () => {
  it('preserves arbitrary group depth', () => {
    const config = normalize({
      pages: [
        'index',
        {
          group: 'Level 1',
          root: 'l1',
          pages: [{ group: 'Level 2', pages: [{ group: 'Level 3', pages: ['deep'] }] }],
        },
      ],
    });

    const level1 = config.navigation.documentation[1] as NavGroupNode;
    const level2 = level1.children[0] as NavGroupNode;
    const level3 = level2.children[0] as NavGroupNode;

    expect(level1.root?.page.slug).toBe('l1');
    expect(level3.label).toBe('Level 3');
    expect((level3.children[0] as NavPageNode).page.slug).toBe('deep');
  });

  it('flattens a tree back to document order', () => {
    const config = normalize({
      pages: ['index', { group: 'G', root: 'g', pages: ['g/a', { group: 'H', pages: ['g/h/b'] }] }],
    });

    expect(flattenNav(config.navigation.documentation).map(page => page.slug)).toEqual([
      'index',
      'g',
      'g/a',
      'g/h/b',
    ]);
  });
});

describe('unsupported page items', () => {
  it('rejects reserved platform keys instead of skipping them', () => {
    // Cast: these shapes are deliberately outside the supported PageItem union.
    expect(() => normalize({ pages: ['index', { openapi: 'GET /users' } as never] })).toThrow(
      /unrecognized page item/,
    );
  });

  it('throws on a genuinely unrecognized item', () => {
    expect(() => normalize({ pages: ['index', { nonsense: true } as never] })).toThrow(
      /unrecognized page item/,
    );
  });
});

describe('validation that must keep failing', () => {
  it('rejects duplicate page references', () => {
    expect(() => normalize({ pages: ['alpha', 'alpha'] })).toThrow(/duplicate page reference/);
  });

  it('rejects duplicate route slugs', () => {
    expect(() => normalize({ pages: ['alpha', 'alpha/index'] })).toThrow(/duplicate route slug/);
  });

  it('rejects duplicate tab ids', () => {
    expect(() =>
      normalize({
        tabs: [
          { tab: 'Guides', pages: ['a'] },
          { tab: 'guides', pages: ['b'] },
        ],
      }),
    ).toThrow(/duplicate tab/);
  });

  it('rejects a tab with no pages', () => {
    expect(() => normalize({ tabs: [{ tab: 'Empty', pages: [] }] })).toThrow(
      /does not contain any/,
    );
  });

  it('reports a missing content file', () => {
    expect(() =>
      normalizeDocsConfig({ navigation: { pages: ['ghost'] } } as DocsConfig, () => undefined),
    ).toThrow(/Missing docs page file/);
  });

  it('rejects navigation mixing multiple primary modes', () => {
    expect(() =>
      normalize({ tabs: [{ tab: 'Docs', pages: ['index'] }], pages: ['index'] }),
    ).toThrow(/exactly one of/);
    expect(() =>
      normalize({
        versions: [{ version: 'v1', pages: ['index'] }],
        dropdowns: [{ dropdown: 'Docs', pages: ['index'] }],
      }),
    ).toThrow(/exactly one of/);
  });

  it('allows groups and pages together as one simple mode', () => {
    const config = normalize({
      groups: [{ group: 'Start', pages: ['index'] }],
      pages: ['extra'],
    });

    expect(config.pages.map(page => page.slug)).toEqual(['index', 'extra']);
  });

  it('rejects empty mode arrays', () => {
    expect(() => normalize({ tabs: [] })).toThrow(/at least one tab/);
    expect(() => normalize({ dropdowns: [] })).toThrow(/at least one dropdown/);
    expect(() => normalize({ versions: [] })).toThrow(/at least one version/);
    expect(() => normalize({ languages: [] })).toThrow(/at least one language/);
  });
});

describe('versions and languages', () => {
  it('renders the default version and reports the ones it skipped', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const config = normalize({
      versions: [
        { version: 'v1', pages: ['v1/index'] },
        { version: 'v2', default: true, pages: ['v2/index'] },
      ],
    });

    expect(config.pages.map(page => page.fileSlug)).toEqual(['v2/index']);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('v1'));
  });

  it('rejects multiple versions marked default', () => {
    expect(() =>
      normalize({
        versions: [
          { version: 'v1', default: true, pages: ['v1/index'] },
          { version: 'v2', default: true, pages: ['v2/index'] },
        ],
      }),
    ).toThrow(/multiple versions are marked "default": v1, v2/);
  });

  it('rejects multiple languages marked default', () => {
    expect(() =>
      normalize({
        languages: [
          { language: 'en', default: true, pages: ['index'] },
          { language: 'es', default: true, pages: ['es/index'] },
        ],
      }),
    ).toThrow(/multiple languages are marked "default": en, es/);
  });

  it('rejects a version mixing primary modes', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() =>
      normalize({
        versions: [
          {
            version: 'v1',
            tabs: [{ tab: 'Docs', pages: ['v1/index'] }],
            pages: ['v1/extra'],
          },
        ],
      }),
    ).toThrow(/exactly one of/);
  });
});

describe('anchors', () => {
  it('collects top-level anchors as link nodes', () => {
    const config = normalize({
      pages: ['index'],
      anchors: [{ anchor: 'Community', href: 'https://example.com/community' }],
    });

    expect(config.anchors).toEqual([
      {
        kind: 'link',
        label: 'Community',
        href: 'https://example.com/community',
        icon: undefined,
        hidden: undefined,
        target: '_blank',
      },
    ]);
  });

  it('rejects an anchor without an href', () => {
    expect(() =>
      normalize({ pages: ['index'], anchors: [{ anchor: 'Community' } as never] }),
    ).toThrow(/must define both "anchor" and "href"/);
  });

  it('rejects an anchor without a label', () => {
    expect(() =>
      normalize({ pages: ['index'], anchors: [{ href: 'https://example.com' } as never] }),
    ).toThrow(/must define both "anchor" and "href"/);
  });
});
