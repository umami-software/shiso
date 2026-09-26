import { describe, expect, it } from 'vitest';
import { normalizeDocsSite } from '@/lib/docs-config';
import { getStandalonePageByPathname, normalizeStandalonePages } from '@/lib/standalone-pages';
import type { DocsConfig, StandalonePageItem } from '@/lib/types';

/** Pretends every referenced docs page exists. */
const resolveDocs = (fileSlug: string) => `/content/docs/${fileSlug}.mdx`;

/** Standalone resolver with a fixed set of existing files. */
const resolvePages = (fileSlug: string) =>
  ({
    home: '/content/pages/home.mdx',
    about: '/content/pages/about.md',
  })[fileSlug];

const site = normalizeDocsSite(
  { navigation: { pages: ['index', 'alpha'] } } as DocsConfig,
  resolveDocs,
  { docsPrefix: '/docs' },
);

function normalize(pages: StandalonePageItem[], docsPrefix = '/docs') {
  return normalizeStandalonePages({ pages } as DocsConfig, resolvePages, site, { docsPrefix });
}

describe('normalizeStandalonePages', () => {
  it('returns an empty list when the key is absent', () => {
    expect(normalizeStandalonePages({} as DocsConfig, resolvePages, site)).toEqual([]);
  });

  it('resolves .mdx and .md files and keeps the title override', () => {
    const pages = normalize([
      { path: '/', page: 'home' },
      { path: '/about', page: 'about', title: 'About us' },
    ]);

    expect(pages).toEqual([
      { path: '/', filePath: '/content/pages/home.mdx', title: undefined, key: 'home' },
      {
        path: '/about',
        filePath: '/content/pages/about.md',
        title: 'About us',
        key: 'about',
      },
    ]);
  });

  it('normalizes trailing slashes and page slug variants', () => {
    const pages = normalize([{ path: '/about/', page: '/pages/about.md' }]);

    expect(pages[0]).toMatchObject({ path: '/about', filePath: '/content/pages/about.md' });
  });

  it('throws for a missing file', () => {
    expect(() => normalize([{ path: '/', page: 'missing' }])).toThrow(
      'Missing standalone page file for "missing"',
    );
  });

  it('throws for malformed paths', () => {
    expect(() => normalize([{ path: 'about', page: 'about' }])).toThrow('must start with "/"');
    expect(() => normalize([{ path: '/about/:id', page: 'about' }])).toThrow('wildcard');
    expect(() => normalize([{ path: '/about.mdx', page: 'about' }])).toThrow('drop the extension');
  });

  it('throws for duplicate paths', () => {
    expect(() =>
      normalize([
        { path: '/about', page: 'about' },
        { path: '/about/', page: 'home' },
      ]),
    ).toThrow('duplicate standalone page path "/about"');
  });

  it('reserves /404 for the error page', () => {
    expect(() => normalize([{ path: '/404', page: 'home' }])).toThrow('reserved');
  });

  it('rejects paths that collide with docs pages', () => {
    expect(() => normalize([{ path: '/docs/alpha', page: 'about' }])).toThrow('collides');
  });

  it('rejects paths inside the docs prefix', () => {
    expect(() => normalize([{ path: '/docs/team', page: 'about' }])).toThrow('docs prefix');
  });

  it('rejects a root page when docs are served at the site root', () => {
    const rootSite = normalizeDocsSite(
      { navigation: { pages: ['index'] } } as DocsConfig,
      resolveDocs,
      { docsPrefix: '' },
    );

    expect(() =>
      normalizeStandalonePages(
        { pages: [{ path: '/', page: 'home' }] } as DocsConfig,
        resolvePages,
        rootSite,
        { docsPrefix: '' },
      ),
    ).toThrow('collides');
  });
});

describe('getStandalonePageByPathname', () => {
  const pages = normalize([
    { path: '/', page: 'home' },
    { path: '/about', page: 'about' },
  ]);

  it('matches exact, trailing-slash, and /index variants', () => {
    expect(getStandalonePageByPathname(pages, '/')?.filePath).toBe('/content/pages/home.mdx');
    expect(getStandalonePageByPathname(pages, '/index')?.filePath).toBe('/content/pages/home.mdx');
    expect(getStandalonePageByPathname(pages, '/about/')?.filePath).toBe('/content/pages/about.md');
  });

  it('returns null for unknown paths', () => {
    expect(getStandalonePageByPathname(pages, '/pricing')).toBeNull();
  });
});

describe('normalizeStandalonePages languages', () => {
  const multiSite = normalizeDocsSite(
    {
      navigation: {
        languages: [
          { language: 'en', pages: ['index'] },
          { language: 'ja', pages: ['ja/index'] },
        ],
      },
    } as DocsConfig,
    resolveDocs,
    { docsPrefix: '/docs' },
  );
  const resolveMulti = (fileSlug: string) =>
    ({ home: '/content/pages/home.tsx', 'ja/home': '/content/pages/ja/home.tsx' })[fileSlug];
  const normalizeMulti = (pages: StandalonePageItem[]) =>
    normalizeStandalonePages({ pages } as DocsConfig, resolveMulti, multiSite, {
      docsPrefix: '/docs',
    });

  it('keeps the language and keys translated pages by their slug without the language folder', () => {
    const pages = normalizeMulti([
      { path: '/', page: 'home' },
      { path: '/ja', page: 'ja/home', language: 'ja' },
    ]);

    expect(pages[0]).toMatchObject({ key: 'home', language: undefined });
    expect(pages[1]).toMatchObject({ path: '/ja', key: 'home', language: 'ja' });
  });

  it('throws for a language missing from navigation.languages', () => {
    expect(() => normalizeMulti([{ path: '/ja', page: 'ja/home', language: 'fr' }])).toThrow(
      'uses language "fr", which is not declared in navigation.languages',
    );
  });
});
