import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Ajv } from 'ajv';
import { describe, expect, it } from 'vitest';
import {
  getSchemaKeys,
  suggestKey,
  validateConfig,
} from '../packages/shiso/scripts/validate-config.mjs';

const root = path.resolve(import.meta.dirname, '..');

const schema = JSON.parse(
  await readFile(path.join(root, 'packages/shiso/docs.schema.json'), 'utf8'),
);
const realConfig = JSON.parse(await readFile(path.join(root, 'docs.json'), 'utf8'));

const minimal = { navigation: { pages: ['index'] } };

describe('schema coverage', () => {
  it('exposes the expected public top-level settings', () => {
    expect(getSchemaKeys(schema).sort()).toEqual([
      '$ref',
      '$schema',
      '$shiso',
      'appearance',
      'background',
      'banner',
      'colors',
      'contextual',
      'description',
      'errors',
      'favicon',
      'fonts',
      'footer',
      'interaction',
      'logo',
      'metadata',
      'name',
      'navbar',
      'navigation',
      'redirects',
      'search',
      'seo',
      'styling',
      'theme',
    ]);
  });

  it('validates the real docs.json', () => {
    expect(validateConfig(realConfig, schema)).toMatchObject({ valid: true, errors: [] });
  });

  it('allows a value reference at every configuration position', () => {
    const ajv = new Ajv({ allowUnionTypes: true });
    const reference = { $ref: './value.json' };
    const failures = [];

    const acceptsReference = valueSchema =>
      ajv.compile({ ...valueSchema, definitions: schema.definitions })(reference);

    const visit = (valueSchema, location) => {
      if (!valueSchema || typeof valueSchema !== 'object' || Array.isArray(valueSchema)) {
        return;
      }

      for (const [key, propertySchema] of Object.entries(valueSchema.properties ?? {})) {
        if (key !== '$ref' && !acceptsReference(propertySchema)) {
          failures.push(`${location}.${key}`);
        }
        visit(propertySchema, `${location}.${key}`);
      }

      if (valueSchema.items) {
        if (!acceptsReference(valueSchema.items)) {
          failures.push(`${location}[]`);
        }
        visit(valueSchema.items, `${location}[]`);
      }

      if (
        valueSchema.additionalProperties &&
        typeof valueSchema.additionalProperties === 'object'
      ) {
        if (!acceptsReference(valueSchema.additionalProperties)) {
          failures.push(`${location}.*`);
        }
        visit(valueSchema.additionalProperties, `${location}.*`);
      }

      for (const keyword of ['oneOf', 'anyOf', 'allOf']) {
        for (const [index, branch] of (valueSchema[keyword] ?? []).entries()) {
          visit(branch, `${location}.${keyword}[${index}]`);
        }
      }
    };

    visit(schema, 'root');
    for (const [name, definition] of Object.entries(schema.definitions)) {
      if (name !== 'configRef') {
        visit(definition, `definitions.${name}`);
      }
    }

    expect(failures).toEqual([]);
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

  it('accepts references wherever arrays and primitive values are expected', () => {
    const result = validateConfig(
      {
        name: { $ref: './values/name.json' },
        theme: { $ref: './values/theme.json' },
        navigation: {
          anchors: { $ref: './navigation/anchors.json' },
          groups: [
            {
              group: { $ref: './values/group-name.json' },
              pages: { $ref: './navigation/pages.json' },
              hidden: { $ref: './values/hidden.json' },
            },
          ],
        },
        appearance: {
          default: { $ref: './values/appearance.json' },
          strict: { $ref: './values/strict.json' },
        },
        fonts: {
          family: { $ref: './values/font-family.json' },
          weight: { $ref: './values/font-weight.json' },
          format: { $ref: './values/font-format.json' },
        },
        search: {
          shortcut: { $ref: './values/search-shortcut.json' },
        },
        contextual: {
          options: { $ref: './contextual/options.json' },
        },
        navbar: {
          links: { $ref: './navbar/links.json' },
        },
        footer: {
          socials: { $ref: './footer/socials.json' },
          attribution: { $ref: './values/attribution.json' },
        },
        redirects: { $ref: './redirects/all.json' },
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

  it('keeps inline primitive and array values strictly validated', () => {
    expect(validateConfig({ ...minimal, theme: 'unknown' }, schema).valid).toBe(false);
    expect(validateConfig({ navigation: { pages: [42] } }, schema).valid).toBe(false);
    expect(validateConfig({ ...minimal, appearance: { strict: 'yes' } }, schema).valid).toBe(false);
  });

  it('rejects malformed value references', () => {
    expect(validateConfig({ ...minimal, name: { $ref: './name.yaml' } }, schema).valid).toBe(false);
  });

  it('accepts ignored siblings on references to non-object values', () => {
    expect(
      validateConfig({ navigation: { pages: { $ref: './pages.json', ignored: true } } }, schema)
        .valid,
    ).toBe(true);
  });
});

describe('undocumented settings', () => {
  it.each(['thumbnails', 'icons', 'api', 'integrations'])('rejects %s', key => {
    expect(validateConfig({ ...minimal, [key]: {} }, schema).valid).toBe(false);
  });

  it('rejects unused nested settings', () => {
    expect(validateConfig({ navigation: { pages: ['index'], global: {} } }, schema).valid).toBe(
      false,
    );
    expect(
      validateConfig(
        { ...minimal, navbar: { links: [{ label: 'GitHub', href: '/', iconType: 'brands' }] } },
        schema,
      ).valid,
    ).toBe(false);
    expect(
      validateConfig(
        {
          navigation: {
            pages: ['index'],
            anchors: [{ anchor: 'Guides', pages: ['guide'] }],
          },
        },
        schema,
      ).valid,
    ).toBe(false);
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

    expect(result).toMatchObject({ valid: true, errors: [] });
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

  it.each(['mcp', 'cursor', 'vscode'])('rejects the hosted contextual option %s', option => {
    expect(validateConfig({ ...minimal, contextual: { options: [option] } }, schema).valid).toBe(
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

    expect(result).toMatchObject({ valid: true, errors: [] });
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
        redirects: [{ source: '/old', destination: '/new' }],
        seo: { metatags: { 'og:image': '/social.png' }, indexing: 'all' },
        errors: { 404: { redirect: false, title: 'Lost?', description: 'Try the **search**.' } },
        metadata: { timestamp: true },
      },
      schema,
    );

    expect(result).toMatchObject({ valid: true, errors: [] });
  });

  it('rejects a redirect without a destination', () => {
    expect(validateConfig({ ...minimal, redirects: [{ source: '/old' }] }, schema).valid).toBe(
      false,
    );
  });

  it('rejects wildcard and status-code redirect settings', () => {
    expect(
      validateConfig(
        { ...minimal, redirects: [{ source: '/old/:slug*', destination: '/new' }] },
        schema,
      ).valid,
    ).toBe(false);
    expect(
      validateConfig(
        { ...minimal, redirects: [{ source: '/old', destination: '/new', permanent: false }] },
        schema,
      ).valid,
    ).toBe(false);
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
        },
      },
      schema,
    );

    expect(result).toMatchObject({ valid: true, errors: [] });
  });

  it('rejects unused styling and background settings', () => {
    expect(validateConfig({ ...minimal, styling: { latex: true } }, schema).valid).toBe(false);
    expect(validateConfig({ ...minimal, styling: { codeblocks: 'dark' } }, schema).valid).toBe(
      false,
    );
    expect(
      validateConfig({ ...minimal, background: { decoration: 'gradient' } }, schema).valid,
    ).toBe(false);
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

describe('navigation mode exclusivity', () => {
  it('rejects navigation mixing primary modes', () => {
    expect(
      validateConfig(
        { navigation: { tabs: [{ tab: 'Docs', pages: ['index'] }], pages: ['index'] } },
        schema,
      ).valid,
    ).toBe(false);
    expect(
      validateConfig(
        {
          navigation: {
            dropdowns: [{ dropdown: 'Docs', pages: ['index'] }],
            versions: [{ version: 'v1', pages: ['index'] }],
          },
        },
        schema,
      ).valid,
    ).toBe(false);
    expect(
      validateConfig(
        {
          navigation: {
            versions: [{ version: 'v1', pages: ['index'] }],
            languages: [{ language: 'en', pages: ['index'] }],
          },
        },
        schema,
      ).valid,
    ).toBe(false);
  });

  it('accepts groups and pages together as one simple mode', () => {
    expect(
      validateConfig(
        { navigation: { groups: [{ group: 'Start', pages: ['index'] }], pages: ['extra'] } },
        schema,
      ),
    ).toMatchObject({ valid: true, errors: [] });
  });

  it('accepts anchors beside a primary mode', () => {
    expect(
      validateConfig(
        {
          navigation: {
            anchors: [{ anchor: 'Status', href: 'https://status.example.com' }],
            pages: ['index'],
          },
        },
        schema,
      ),
    ).toMatchObject({ valid: true, errors: [] });
  });

  it('accepts a single versions or languages mode', () => {
    expect(
      validateConfig(
        { navigation: { versions: [{ version: 'v2', default: true, pages: ['index'] }] } },
        schema,
      ),
    ).toMatchObject({ valid: true, errors: [] });
    expect(
      validateConfig(
        {
          navigation: {
            languages: [{ language: 'en', versions: [{ version: 'v1', pages: ['index'] }] }],
          },
        },
        schema,
      ),
    ).toMatchObject({ valid: true, errors: [] });
  });

  it('rejects empty versions and languages arrays', () => {
    expect(validateConfig({ navigation: { versions: [] } }, schema).valid).toBe(false);
    expect(validateConfig({ navigation: { languages: [] } }, schema).valid).toBe(false);
  });

  it('applies exclusivity inside versions and languages', () => {
    expect(
      validateConfig(
        {
          navigation: {
            versions: [
              { version: 'v1', tabs: [{ tab: 'Docs', pages: ['index'] }], pages: ['extra'] },
            ],
          },
        },
        schema,
      ).valid,
    ).toBe(false);
    expect(
      validateConfig(
        {
          navigation: {
            languages: [
              { language: 'en', versions: [{ version: 'v1', pages: ['index'] }], pages: ['extra'] },
            ],
          },
        },
        schema,
      ).valid,
    ).toBe(false);
  });

  it('requires anchors to define both anchor and href', () => {
    expect(
      validateConfig(
        { navigation: { pages: ['index'], anchors: [{ anchor: 'Community' }] } },
        schema,
      ).valid,
    ).toBe(false);
    expect(
      validateConfig(
        { navigation: { pages: ['index'], anchors: [{ href: 'https://example.com' }] } },
        schema,
      ).valid,
    ).toBe(false);
  });
});
