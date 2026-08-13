import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  DocsConfigLoadError,
  loadDocsConfig,
  loadDocsSchema,
} from '../scripts/load-docs-config.mjs';

const temporaryDirectories = [];

async function temporaryProject() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'shiso-config-test-'));
  const canonicalRoot = await fs.realpath(root);
  temporaryDirectories.push(canonicalRoot);
  return canonicalRoot;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(root => fs.rm(root, { recursive: true, force: true })),
  );
});

describe('loadDocsConfig', () => {
  it('returns the parsed config and resolved source metadata', async () => {
    const root = await temporaryProject();
    await fs.writeFile(path.join(root, 'docs.json'), '{"navigation":{"pages":["index"]}}');

    const result = await loadDocsConfig({ root });

    expect(result.config).toEqual({ navigation: { pages: ['index'] } });
    expect(result.projectRoot).toBe(root);
    expect(result.sourcePath).toBe(path.join(root, 'docs.json'));
    expect(result.sourcePaths).toEqual([path.join(root, 'docs.json')]);
  });

  it('supports an alternate config filename relative to the project root', async () => {
    const root = await temporaryProject();
    await fs.mkdir(path.join(root, 'config'));
    await fs.writeFile(path.join(root, 'config/site.json'), '{"navigation":{"pages":[]}}');

    const result = await loadDocsConfig({ root, configFile: 'config/site.json' });

    expect(result.config.navigation.pages).toEqual([]);
    expect(result.sourcePath).toBe(path.join(root, 'config/site.json'));
  });

  it('reports a missing config with a stable error code and source path', async () => {
    const root = await temporaryProject();
    const sourcePath = path.join(root, 'docs.json');

    await expect(loadDocsConfig({ root })).rejects.toMatchObject({
      name: 'DocsConfigLoadError',
      code: 'NOT_FOUND',
      sourcePath,
    });
  });

  it('reports malformed JSON with source location context', async () => {
    const root = await temporaryProject();
    const sourcePath = path.join(root, 'docs.json');
    await fs.writeFile(sourcePath, '{\n  "navigation":,\n}');

    try {
      await loadDocsConfig({ root });
      throw new Error('Expected the malformed config to fail.');
    } catch (error) {
      expect(error).toBeInstanceOf(DocsConfigLoadError);
      expect(error).toMatchObject({ code: 'INVALID_JSON', sourcePath });
      expect(error.message).toContain(sourcePath);
      expect(error.message).toMatch(/line \d+, column \d+/);
    }
  });

  it('resolves nested references relative to the file that declares them', async () => {
    const root = await temporaryProject();
    await fs.mkdir(path.join(root, 'config/navigation'), { recursive: true });
    await fs.writeFile(
      path.join(root, 'docs.json'),
      JSON.stringify({
        name: 'Site override',
        navigation: { $ref: './config/navigation/index.json' },
      }),
    );
    await fs.writeFile(
      path.join(root, 'config/navigation/index.json'),
      JSON.stringify({ $ref: './pages.json', anchors: [{ anchor: 'Home', href: '/' }] }),
    );
    await fs.writeFile(
      path.join(root, 'config/navigation/pages.json'),
      JSON.stringify({ pages: ['index'], anchors: [{ anchor: 'Old', href: '/old' }] }),
    );

    const result = await loadDocsConfig({ root });

    expect(result.config).toEqual({
      name: 'Site override',
      navigation: {
        pages: ['index'],
        anchors: [{ anchor: 'Home', href: '/' }],
      },
    });
    expect(result.sourcePaths).toEqual([
      path.join(root, 'docs.json'),
      path.join(root, 'config/navigation/index.json'),
      path.join(root, 'config/navigation/pages.json'),
    ]);
  });

  it('merges root object siblings over a referenced config', async () => {
    const root = await temporaryProject();
    await fs.writeFile(
      path.join(root, 'docs.json'),
      JSON.stringify({ $ref: './base.json', name: 'Override' }),
    );
    await fs.writeFile(
      path.join(root, 'base.json'),
      JSON.stringify({ name: 'Base', navigation: { pages: ['index'] } }),
    );

    await expect(loadDocsConfig({ root })).resolves.toMatchObject({
      config: { name: 'Override', navigation: { pages: ['index'] } },
    });
  });

  it('allows references to arrays and ignores siblings on non-object targets', async () => {
    const root = await temporaryProject();
    await fs.mkdir(path.join(root, 'config'));
    await fs.writeFile(
      path.join(root, 'docs.json'),
      JSON.stringify({
        navigation: {
          pages: { $ref: './config/pages.json', ignored: true },
        },
      }),
    );
    await fs.writeFile(path.join(root, 'config/pages.json'), JSON.stringify(['index', 'guide']));

    const result = await loadDocsConfig({ root });

    expect(result.config.navigation.pages).toEqual(['index', 'guide']);
  });

  it.each([
    [{ navigation: { $ref: '' } }, 'INVALID_REF'],
    [{ navigation: { $ref: 42 } }, 'INVALID_REF'],
    [{ navigation: { $ref: 'navigation.yaml' } }, 'INVALID_REF'],
    [{ navigation: { $ref: 'https://example.com/navigation.json' } }, 'INVALID_REF'],
  ])('rejects an invalid reference value in %j', async (config, code) => {
    const root = await temporaryProject();
    await fs.writeFile(path.join(root, 'docs.json'), JSON.stringify(config));

    await expect(loadDocsConfig({ root })).rejects.toMatchObject({
      name: 'DocsConfigLoadError',
      code,
      sourcePath: path.join(root, 'docs.json'),
    });
  });

  it('rejects references that leave the project root', async () => {
    const root = await temporaryProject();
    await fs.writeFile(path.join(root, 'docs.json'), JSON.stringify({ $ref: '../outside.json' }));

    await expect(loadDocsConfig({ root })).rejects.toMatchObject({
      code: 'REF_OUTSIDE_ROOT',
      sourcePath: path.join(path.dirname(root), 'outside.json'),
    });
  });

  it('rejects a root config filename outside the project root', async () => {
    const root = await temporaryProject();

    await expect(loadDocsConfig({ root, configFile: '../outside.json' })).rejects.toMatchObject({
      code: 'REF_OUTSIDE_ROOT',
      sourcePath: path.join(path.dirname(root), 'outside.json'),
    });
  });

  it('rejects symlinks that resolve outside the project root', async () => {
    const root = await temporaryProject();
    const outside = await temporaryProject();
    await fs.writeFile(path.join(outside, 'navigation.json'), JSON.stringify({ pages: ['index'] }));
    await fs.symlink(path.join(outside, 'navigation.json'), path.join(root, 'navigation.json'));
    await fs.writeFile(
      path.join(root, 'docs.json'),
      JSON.stringify({ navigation: { $ref: './navigation.json' } }),
    );

    await expect(loadDocsConfig({ root })).rejects.toMatchObject({
      code: 'REF_OUTSIDE_ROOT',
      sourcePath: path.join(root, 'navigation.json'),
    });
  });

  it('reports missing referenced files separately from a missing root config', async () => {
    const root = await temporaryProject();
    await fs.writeFile(
      path.join(root, 'docs.json'),
      JSON.stringify({ navigation: { $ref: './missing.json' } }),
    );

    await expect(loadDocsConfig({ root })).rejects.toMatchObject({
      code: 'NOT_FOUND',
      sourcePath: path.join(root, 'missing.json'),
    });
  });

  it('detects direct and transitive reference cycles', async () => {
    const root = await temporaryProject();
    await fs.writeFile(path.join(root, 'docs.json'), JSON.stringify({ $ref: './a.json' }));
    await fs.writeFile(path.join(root, 'a.json'), JSON.stringify({ $ref: './b.json' }));
    await fs.writeFile(path.join(root, 'b.json'), JSON.stringify({ $ref: './a.json' }));

    try {
      await loadDocsConfig({ root });
      throw new Error('Expected the reference cycle to fail.');
    } catch (error) {
      expect(error).toMatchObject({ code: 'CIRCULAR_REF', sourcePath: path.join(root, 'a.json') });
      expect(error.message).toContain('a.json -> b.json -> a.json');
    }
  });
});

describe('loadDocsSchema', () => {
  it('uses the same source-aware JSON loading path for the schema', async () => {
    const root = await temporaryProject();
    await fs.writeFile(path.join(root, 'docs.schema.json'), '{"type":"object"}');

    const result = await loadDocsSchema({ root });

    expect(result.schema).toEqual({ type: 'object' });
    expect(result.sourcePath).toBe(path.join(root, 'docs.schema.json'));
  });
});
