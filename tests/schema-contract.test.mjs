import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getSchemaKeys } from '../packages/shiso/scripts/validate-config.mjs';

const root = path.resolve(import.meta.dirname, '..');
const schema = JSON.parse(
  await readFile(path.join(root, 'packages/shiso/docs.schema.json'), 'utf8'),
);

/**
 * Maps every documented top-level docs.json setting to the runtime code that
 * consumes it, so nothing the schema accepts can be silently ignored.
 *
 * When this test fails, either a new schema key needs an implementation (add
 * its reader here once it exists) or a key was removed (delete its entry).
 * `passthrough` marks the two deliberate exceptions, with the reason.
 */
const IMPLEMENTATION = {
  // Resolved while loading the config file, before validation.
  $ref: { file: 'packages/shiso/scripts/load-docs-config.mjs', pattern: /\$ref/ },
  // Editor-only metadata: points editors at this schema and is otherwise inert.
  $schema: { passthrough: 'editor metadata' },
  $shiso: { file: 'packages/shiso/src/lib/paths.ts', pattern: /\.\$shiso/ },
  appearance: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.appearance/ },
  background: { file: 'packages/shiso/vite.config.ts', pattern: /background/ },
  banner: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.banner/ },
  colors: { file: 'packages/shiso/vite.config.ts', pattern: /colors/ },
  contextual: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.contextual/ },
  description: { file: 'packages/shiso/src/lib/head.ts', pattern: /siteConfig\.description/ },
  errors: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.errors/ },
  favicon: { file: 'packages/shiso/vite.config.ts', pattern: /favicon/ },
  fonts: { file: 'packages/shiso/vite.config.ts', pattern: /fonts/ },
  footer: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.footer/ },
  interaction: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.interaction/ },
  logo: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.logo/ },
  metadata: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.metadata/ },
  name: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.name/ },
  navbar: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.navbar/ },
  navigation: { file: 'packages/shiso/src/lib/docs-config.ts', pattern: /\.navigation/ },
  redirects: { file: 'packages/shiso/src/lib/site-config.ts', pattern: /siteConfig\.redirects/ },
  search: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.search/ },
  seo: { file: 'packages/shiso/src/lib/site-config.ts', pattern: /siteConfig\.seo/ },
  styling: { file: 'packages/shiso/src/lib/site-model.ts', pattern: /config\.styling/ },
  // Only one theme exists; the enum rejects everything but "shiso", and the
  // shiso theme is what renders.
  theme: { passthrough: 'single-theme enum' },
};

describe('schema-to-implementation contract', () => {
  it('accounts for every documented top-level setting', () => {
    expect(Object.keys(IMPLEMENTATION).sort()).toEqual(getSchemaKeys(schema).sort());
  });

  it.each(Object.entries(IMPLEMENTATION).filter(([, spec]) => !spec.passthrough))(
    '%s is read by its implementation file',
    async (_key, spec) => {
      const source = await readFile(path.join(root, spec.file), 'utf8');

      expect(source).toMatch(spec.pattern);
    },
  );

  it('keeps the theme enum closed to the implemented theme', () => {
    expect(schema.properties.theme.anyOf[0].enum).toEqual(['shiso']);
  });
});
