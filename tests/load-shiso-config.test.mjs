import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  loadShisoConfig,
  resolveShisoConfig,
  SHISO_CONFIG_FILES,
} from '../packages/shiso/scripts/load-shiso-config.mjs';

const temporaryDirectories = [];

async function temporaryProject() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'shiso-code-config-test-'));
  const canonicalRoot = await fs.realpath(root);
  temporaryDirectories.push(canonicalRoot);
  return canonicalRoot;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(root => fs.rm(root, { recursive: true, force: true })),
  );
});

const DEFAULTS = {
  docsPrefix: '/docs',
  contentDir: 'content/docs',
  siteUrl: undefined,
  locale: 'en-US',
};

describe('resolveShisoConfig', () => {
  it('applies defaults for an empty config', () => {
    expect(resolveShisoConfig()).toEqual(DEFAULTS);
    expect(resolveShisoConfig({})).toEqual(DEFAULTS);
  });

  it('normalizes prefixes, directories, and the site origin', () => {
    expect(resolveShisoConfig({ docsPrefix: '/' })).toMatchObject({ docsPrefix: '' });
    expect(resolveShisoConfig({ docsPrefix: '' })).toMatchObject({ docsPrefix: '' });
    expect(resolveShisoConfig({ docsPrefix: 'guides/' })).toMatchObject({ docsPrefix: '/guides' });
    expect(resolveShisoConfig({ contentDir: '/content/help/' })).toMatchObject({
      contentDir: 'content/help',
    });
    expect(resolveShisoConfig({ siteUrl: 'https://example.com/' })).toMatchObject({
      siteUrl: 'https://example.com',
    });
    expect(resolveShisoConfig({ siteUrl: '  ' })).toMatchObject({ siteUrl: undefined });
    expect(resolveShisoConfig({ locale: ' fr-FR ' })).toMatchObject({ locale: 'fr-FR' });
  });

  it('rejects non-string option values', () => {
    expect(() => resolveShisoConfig({ docsPrefix: 42 })).toThrowError(/must be a string/);
    expect(() => resolveShisoConfig({ locale: ['fr-FR'] })).toThrowError(/must be a string/);
  });
});

describe('loadShisoConfig', () => {
  it('returns resolved defaults when no config file exists', async () => {
    const root = await temporaryProject();

    const result = await loadShisoConfig({ root });

    expect(result.config).toEqual(DEFAULTS);
    expect(result.sourcePath).toBeNull();
    expect(result.sourcePaths).toEqual([]);
  });

  it('loads a TypeScript config file', async () => {
    const root = await temporaryProject();
    await fs.writeFile(
      path.join(root, 'shiso.config.ts'),
      `const siteUrl: string = 'https://example.com';\nexport default { siteUrl, locale: 'de-DE' };\n`,
    );

    const result = await loadShisoConfig({ root });

    expect(result.config).toEqual({
      ...DEFAULTS,
      siteUrl: 'https://example.com',
      locale: 'de-DE',
    });
    expect(result.sourcePath).toBe(path.join(root, 'shiso.config.ts'));
    expect(result.sourcePaths).toEqual([path.join(root, 'shiso.config.ts')]);
  });

  it.each(['shiso.config.mjs', 'shiso.config.js'])('loads %s', async filename => {
    const root = await temporaryProject();
    await fs.writeFile(
      path.join(root, filename),
      `export default { docsPrefix: '/help' };\n`,
    );

    const result = await loadShisoConfig({ root });

    expect(result.config).toMatchObject({ docsPrefix: '/help' });
    expect(result.sourcePath).toBe(path.join(root, filename));
  });

  it('re-evaluates the config on every load', async () => {
    const root = await temporaryProject();
    const sourcePath = path.join(root, 'shiso.config.ts');
    await fs.writeFile(sourcePath, `export default { locale: 'before' };\n`);

    expect((await loadShisoConfig({ root })).config.locale).toBe('before');

    await fs.writeFile(sourcePath, `export default { locale: 'after' };\n`);

    expect((await loadShisoConfig({ root })).config.locale).toBe('after');
  });

  it('rejects multiple config files', async () => {
    const root = await temporaryProject();
    await fs.writeFile(path.join(root, 'shiso.config.ts'), 'export default {};\n');
    await fs.writeFile(path.join(root, 'shiso.config.js'), 'export default {};\n');

    await expect(loadShisoConfig({ root })).rejects.toMatchObject({
      name: 'ShisoConfigLoadError',
      code: 'MULTIPLE_CONFIGS',
    });
  });

  it('rejects a non-object default export', async () => {
    const root = await temporaryProject();
    await fs.writeFile(path.join(root, 'shiso.config.ts'), `export default ['nope'];\n`);

    await expect(loadShisoConfig({ root })).rejects.toMatchObject({
      name: 'ShisoConfigLoadError',
      code: 'INVALID_CONFIG',
    });
  });

  it('rejects unknown keys with the supported key list', async () => {
    const root = await temporaryProject();
    await fs.writeFile(
      path.join(root, 'shiso.config.ts'),
      `export default { siteURL: 'https://example.com' };\n`,
    );

    await expect(loadShisoConfig({ root })).rejects.toMatchObject({
      name: 'ShisoConfigLoadError',
      code: 'UNKNOWN_OPTION',
      message: expect.stringContaining('docsPrefix, contentDir, siteUrl, locale'),
    });
  });

  it('wraps evaluation failures with the source path', async () => {
    const root = await temporaryProject();
    const sourcePath = path.join(root, 'shiso.config.ts');
    await fs.writeFile(sourcePath, `export default {`);

    await expect(loadShisoConfig({ root })).rejects.toMatchObject({
      name: 'ShisoConfigLoadError',
      code: 'LOAD_FAILED',
      sourcePath,
    });
  });

  it('keeps every candidate filename covered by the loader', () => {
    expect(SHISO_CONFIG_FILES).toEqual(['shiso.config.ts', 'shiso.config.mjs', 'shiso.config.js']);
  });
});
