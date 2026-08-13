import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getKeyTiers, suggestKey, validateConfig } from '../scripts/validate-config.mjs';

const root = path.resolve(import.meta.dirname, '..');

const schema = JSON.parse(await readFile(path.join(root, 'docs.schema.json'), 'utf8'));
const support = JSON.parse(await readFile(path.join(root, 'docs.support.json'), 'utf8'));
const realConfig = JSON.parse(await readFile(path.join(root, 'docs.json'), 'utf8'));

const minimal = { navigation: { pages: ['index'] } };

describe('schema coverage', () => {
  it('classifies every schema key in the Shiso support contract', () => {
    const declared = Object.keys(getKeyTiers(schema)).sort();
    const contracted = Object.entries(support.fields)
      .filter(([, field]) => field.status !== 'unsupported' && field.schema !== false)
      .map(([key]) => key)
      .sort();

    expect(contracted).toEqual(declared);
  });

  it('keeps unsupported top-level keys out of the schema', () => {
    const declared = new Set(Object.keys(getKeyTiers(schema)));
    const unsupported = Object.entries(support.fields)
      .filter(([, field]) => field.status === 'unsupported')
      .map(([key]) => key);

    expect(unsupported.filter(key => declared.has(key))).toEqual([]);
  });

  it('uses only documented support categories', () => {
    const categories = new Set(Object.keys(support.categories));
    const statuses = [
      ...Object.values(support.fields).map(field => field.status),
      ...support.exceptions.map(field => field.status),
    ];

    expect(statuses.filter(status => !categories.has(status))).toEqual([]);
  });

  it('matches reserved schema keys to recognized contract fields', () => {
    const reserved = Object.entries(getKeyTiers(schema))
      .filter(([, tier]) => tier === 'reserved')
      .map(([key]) => key)
      .sort();
    const recognized = Object.entries(support.fields)
      .filter(([, field]) => field.status === 'recognized')
      .map(([key]) => key)
      .sort();

    expect(recognized).toEqual(reserved);
  });

  it('validates the real docs.json', () => {
    expect(validateConfig(realConfig, schema)).toMatchObject({ valid: true, errors: [] });
  });
});

describe('$ref schema support', () => {
  it('accepts a relative JSON reference at the root', () => {
    expect(validateConfig({ $ref: './config/site.json' }, schema)).toMatchObject({
      valid: true,
      errors: [],
    });
  });

  it('accepts references for nested configuration objects and array items', () => {
    const result = validateConfig(
      {
        navigation: {
          groups: [{ $ref: './navigation/getting-started.json' }],
          pages: [{ $ref: './navigation/index.json' }],
        },
        fonts: { $ref: './styles/fonts.json' },
        navbar: {
          links: [{ $ref: './links/github.json' }],
        },
        redirects: [{ $ref: './redirects/legacy.json' }],
      },
      schema,
    );

    expect(result).toMatchObject({ valid: true, errors: [] });
  });

  it('accepts inline object siblings beside a reference', () => {
    const result = validateConfig(
      {
        navigation: {
          $ref: './navigation/base.json',
          anchors: [{ anchor: 'Status', href: 'https://status.example.com' }],
        },
      },
      schema,
    );

    expect(result).toMatchObject({ valid: true, errors: [] });
  });

  it.each([
    '',
    '/absolute/config.json',
    'https://example.com/config.json',
    'file:///tmp/config.json',
    './config.yaml',
  ])('rejects an invalid reference path: %s', ref => {
    expect(validateConfig({ $ref: ref }, schema).valid).toBe(false);
  });

  it('keeps required fields mandatory for ordinary inline objects', () => {
    expect(validateConfig({ navigation: { groups: [{}] } }, schema).valid).toBe(false);
    expect(validateConfig({ ...minimal, fonts: {} }, schema).valid).toBe(false);
    expect(validateConfig({ ...minimal, banner: {} }, schema).valid).toBe(false);
  });
});

describe('reserved keys', () => {
  it('accepts them and reports one notice each', () => {
    const result = validateConfig(
      { ...minimal, thumbnails: {}, integrations: {}, api: {} },
      schema,
    );

    expect(result.valid).toBe(true);
    expect(result.notices).toHaveLength(3);
    expect(result.notices.join('\n')).toContain('"integrations"');
  });

  it('reports nothing for a config that uses only supported keys', () => {
    expect(validateConfig(minimal, schema).notices).toEqual([]);
  });
});

describe('search, interaction, and contextual', () => {
  it('accepts a full configuration', () => {
    const result = validateConfig(
      {
        ...minimal,
        search: {
          prompt: 'Search the docs...',
          provider: 'hosted',
          options: { index: 'docs' },
        },
        interaction: { drilldown: false },
        contextual: {
          options: [
            'copy',
            'view',
            'chatgpt',
            'claude',
            'mcp',
            {
              title: 'Ask our bot',
              description: 'Send this page to the support bot',
              href: 'https://example.com/ask?page=$path',
            },
          ],
        },
      },
      schema,
    );

    expect(result).toMatchObject({ valid: true, errors: [], notices: [] });
  });

  it('accepts false to disable search', () => {
    expect(validateConfig({ ...minimal, search: false }, schema)).toMatchObject({
      valid: true,
      errors: [],
    });
  });

  it('rejects true and unknown search settings', () => {
    expect(validateConfig({ ...minimal, search: true }, schema).valid).toBe(false);
    expect(validateConfig({ ...minimal, search: { unknown: true } }, schema).valid).toBe(false);
  });

  it('rejects an unknown contextual option', () => {
    expect(validateConfig({ ...minimal, contextual: { options: ['bogus'] } }, schema).valid).toBe(
      false,
    );
  });

  it('rejects a custom contextual option without href', () => {
    expect(
      validateConfig({ ...minimal, contextual: { options: [{ title: 'X' }] } }, schema).valid,
    ).toBe(false);
  });
});

describe('unknown keys', () => {
  it('rejects them', () => {
    const result = validateConfig({ ...minimal, totallyMadeUp: true }, schema);

    expect(result.valid).toBe(false);
    expect(result.errors.join('\n')).toContain('totallyMadeUp');
  });

  it('suggests the intended key for a likely typo', () => {
    const result = validateConfig({ ...minimal, navigaton: {} }, schema);

    expect(result.errors.join('\n')).toContain('did you mean "navigation"');
  });

  it('does not guess when nothing is close', () => {
    expect(suggestKey('zzzzzzzzzz', ['navigation', 'colors'])).toBeNull();
  });
});

describe('supported keys stay strictly validated', () => {
  it('rejects an unknown key inside navigation', () => {
    const result = validateConfig({ navigation: { pages: ['index'], bogus: 1 } }, schema);

    expect(result.valid).toBe(false);
  });

  it('accepts external links and hidden flags in the navigation tree', () => {
    const result = validateConfig(
      {
        navigation: {
          pages: [
            'index',
            { page: 'a', hidden: true, tag: 'beta' },
            { href: 'https://example.com', label: 'Out' },
            { group: 'G', icon: 'rocket', pages: ['b'] },
          ],
          anchors: [{ anchor: 'Community', href: 'https://example.com' }],
        },
      },
      schema,
    );

    expect(result).toMatchObject({ valid: true, errors: [] });
  });

  it('requires navigation', () => {
    expect(validateConfig({ name: 'Docs' }, schema).valid).toBe(false);
  });

  it('accepts a full navbar, footer, and banner', () => {
    const result = validateConfig(
      {
        ...minimal,
        navbar: {
          links: [
            { icon: 'github', ariaLabel: 'GitHub', href: 'https://github.com/example/repo' },
            { label: 'Community', href: 'https://example.com', icon: 'users' },
          ],
          primary: { label: 'Get Started', href: 'https://example.com' },
        },
        footer: {
          attribution: true,
          socials: [
            { icon: 'x', ariaLabel: 'X', href: 'https://x.com/example' },
            { icon: 'github', ariaLabel: 'GitHub', href: 'https://github.com/example' },
          ],
          links: [
            { header: 'Resources', items: [{ label: 'Blog', href: 'https://example.com/blog' }] },
          ],
        },
        banner: {
          content: 'Now in **beta** — [read more](https://example.com)',
          dismissible: true,
        },
      },
      schema,
    );

    expect(result).toMatchObject({ valid: true, errors: [], notices: [] });
  });

  it('rejects a navbar link without href', () => {
    expect(validateConfig({ ...minimal, navbar: { links: [{ label: 'x' }] } }, schema).valid).toBe(
      false,
    );
  });

  it('rejects a navbar link without a label or icon', () => {
    expect(
      validateConfig({ ...minimal, navbar: { links: [{ href: 'https://example.com' }] } }, schema)
        .valid,
    ).toBe(false);
  });

  it('rejects platform-specific navbar types and keyed social objects', () => {
    expect(
      validateConfig(
        {
          ...minimal,
          navbar: { links: [{ type: 'github', href: 'https://github.com/example' }] },
        },
        schema,
      ).valid,
    ).toBe(false);
    expect(
      validateConfig(
        { ...minimal, footer: { socials: { github: 'https://github.com/example' } } },
        schema,
      ).valid,
    ).toBe(false);
  });

  it('accepts generic socials and rejects entries without visible or icon content', () => {
    expect(
      validateConfig(
        {
          ...minimal,
          footer: {
            socials: [
              { icon: 'music', ariaLabel: 'Music', href: 'https://example.com', target: '_blank' },
            ],
          },
        },
        schema,
      ).valid,
    ).toBe(true);
    expect(
      validateConfig({ ...minimal, footer: { socials: [{ href: 'https://example.com' }] } }, schema)
        .valid,
    ).toBe(false);
  });

  it('accepts boolean footer attribution and rejects attribution objects', () => {
    expect(validateConfig({ ...minimal, footer: { attribution: true } }, schema).valid).toBe(true);
    expect(validateConfig({ ...minimal, footer: { attribution: false } }, schema).valid).toBe(true);
    expect(
      validateConfig({ ...minimal, footer: { attribution: { label: 'Powered by Shiso' } } }, schema)
        .valid,
    ).toBe(false);
  });

  it('rejects a banner without content', () => {
    expect(validateConfig({ ...minimal, banner: { dismissible: true } }, schema).valid).toBe(false);
  });

  it('accepts redirects, seo, errors, and metadata', () => {
    const result = validateConfig(
      {
        ...minimal,
        redirects: [{ source: '/old', destination: '/new', permanent: false }],
        seo: { metatags: { 'og:image': '/social.png' }, indexing: 'all' },
        errors: { 404: { redirect: false, title: 'Lost?', description: 'Try the **search**.' } },
        metadata: { timestamp: true },
      },
      schema,
    );

    expect(result).toMatchObject({ valid: true, errors: [], notices: [] });
  });

  it('rejects a redirect without a destination', () => {
    expect(validateConfig({ ...minimal, redirects: [{ source: '/old' }] }, schema).valid).toBe(
      false,
    );
  });

  it('rejects an invalid seo.indexing value', () => {
    expect(validateConfig({ ...minimal, seo: { indexing: 'some' } }, schema).valid).toBe(false);
  });

  it('accepts appearance, styling, fonts, and background', () => {
    const result = validateConfig(
      {
        ...minimal,
        appearance: { default: 'dark', strict: true },
        styling: { eyebrows: 'breadcrumbs' },
        fonts: {
          family: 'Open Sans',
          weight: 550,
          heading: { family: 'Playfair Display', weight: 700 },
          body: { family: 'Hubot Sans', source: '/fonts/Hubot-Sans.woff2', format: 'woff2' },
        },
        background: {
          color: { light: '#ffffff', dark: '#0f172a' },
          image: { light: '/bg.png', dark: '/bg-dark.png' },
          decoration: 'gradient',
        },
      },
      schema,
    );

    expect(result).toMatchObject({ valid: true, errors: [], notices: [] });
  });

  it('rejects fonts without a family', () => {
    expect(validateConfig({ ...minimal, fonts: { weight: 400 } }, schema).valid).toBe(false);
    expect(
      validateConfig({ ...minimal, fonts: { family: 'X', heading: { weight: 700 } } }, schema)
        .valid,
    ).toBe(false);
  });

  it('rejects an invalid appearance default', () => {
    expect(validateConfig({ ...minimal, appearance: { default: 'auto' } }, schema).valid).toBe(
      false,
    );
  });
});
