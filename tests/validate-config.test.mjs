import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getKeyTiers, suggestKey, validateConfig } from '../scripts/validate-config.mjs';

const root = path.resolve(import.meta.dirname, '..');

const schema = JSON.parse(await readFile(path.join(root, 'docs.schema.json'), 'utf8'));
const realConfig = JSON.parse(await readFile(path.join(root, 'docs.json'), 'utf8'));

const minimal = { navigation: { pages: ['index'] } };

/**
 * Every top-level key of the docs.json standard must be declared in the schema,
 * in one tier or the other. A config written against the full standard has to
 * build here — that is the whole point of the reserved tier — so an omission is
 * a forward-compatibility bug, not a missing feature.
 */
const STANDARD_KEYS = [
  'theme',
  'name',
  'colors',
  'description',
  'logo',
  'favicon',
  'thumbnails',
  'styling',
  'icons',
  'fonts',
  'appearance',
  'background',
  'navbar',
  'navigation',
  'interaction',
  'metadata',
  'footer',
  'banner',
  'redirects',
  'contextual',
  'api',
  'seo',
  'search',
  'integrations',
  'errors',
];

describe('schema coverage', () => {
  it('declares every top-level key of the standard', () => {
    const declared = Object.keys(getKeyTiers(schema));
    const missing = STANDARD_KEYS.filter(key => !declared.includes(key));

    expect(missing).toEqual([]);
  });

  it('validates the real docs.json', () => {
    expect(validateConfig(realConfig, schema)).toMatchObject({ valid: true, errors: [] });
  });
});

describe('reserved keys', () => {
  it('accepts them and reports one notice each', () => {
    const result = validateConfig(
      { ...minimal, footer: { socials: {} }, banner: { content: 'hi' }, redirects: [] },
      schema,
    );

    expect(result.valid).toBe(true);
    expect(result.notices).toHaveLength(3);
    expect(result.notices.join('\n')).toContain('"banner"');
  });

  it('reports nothing for a config that uses only supported keys', () => {
    expect(validateConfig(minimal, schema).notices).toEqual([]);
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
});
