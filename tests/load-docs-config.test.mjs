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
  temporaryDirectories.push(root);
  return root;
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
