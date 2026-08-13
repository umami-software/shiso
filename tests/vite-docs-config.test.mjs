import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDocsConfigModule, VIRTUAL_DOCS_CONFIG_ID } from '../scripts/vite-docs-config.mjs';

const temporaryDirectories = [];

async function temporaryProject(config) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'shiso-vite-config-test-'));
  const canonicalRoot = await fs.realpath(root);
  temporaryDirectories.push(canonicalRoot);
  await fs.writeFile(path.join(canonicalRoot, 'docs.json'), JSON.stringify(config));
  return canonicalRoot;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(root => fs.rm(root, { recursive: true, force: true })),
  );
});

describe('createDocsConfigModule', () => {
  it('exposes the loaded config through a virtual module', async () => {
    const config = { navigation: { pages: ['index'] }, name: 'Docs' };
    const root = await temporaryProject(config);
    const configModule = await createDocsConfigModule({ root });
    const resolvedId = configModule.plugin.resolveId(VIRTUAL_DOCS_CONFIG_ID);
    const addWatchFile = vi.fn();
    const moduleSource = configModule.plugin.load.call({ addWatchFile }, resolvedId);

    expect(configModule.getConfig()).toEqual(config);
    expect(moduleSource).toBe(`export default ${JSON.stringify(config)};`);
    expect(addWatchFile).toHaveBeenCalledWith(path.join(root, 'docs.json'));
  });

  it('ignores unrelated module ids', async () => {
    const root = await temporaryProject({ navigation: { pages: [] } });
    const { plugin } = await createDocsConfigModule({ root });

    expect(plugin.resolveId('some-package')).toBeUndefined();
    expect(plugin.load.call({ addWatchFile: vi.fn() }, 'some-package')).toBeUndefined();
  });

  it('reloads config state and invalidates the virtual module on config edits', async () => {
    const root = await temporaryProject({ navigation: { pages: ['before'] } });
    const configModule = await createDocsConfigModule({ root });
    const resolvedId = configModule.plugin.resolveId(VIRTUAL_DOCS_CONFIG_ID);
    const virtualModule = { id: resolvedId };
    const invalidateModule = vi.fn();
    const send = vi.fn();

    await fs.writeFile(
      path.join(root, 'docs.json'),
      JSON.stringify({ navigation: { pages: ['after'] } }),
    );
    await configModule.plugin.handleHotUpdate({
      file: path.join(root, 'docs.json'),
      server: {
        moduleGraph: {
          getModuleById: vi.fn(() => virtualModule),
          invalidateModule,
        },
        ws: { send },
      },
    });

    expect(configModule.getConfig()).toEqual({ navigation: { pages: ['after'] } });
    expect(invalidateModule).toHaveBeenCalledWith(virtualModule);
    expect(send).toHaveBeenCalledWith({ type: 'full-reload' });
  });

  it('watches referenced configs and reloads when one changes', async () => {
    const root = await temporaryProject({ navigation: { $ref: './navigation.json' } });
    const referencePath = path.join(root, 'navigation.json');
    await fs.writeFile(referencePath, JSON.stringify({ pages: ['before'] }));
    const configModule = await createDocsConfigModule({ root });
    const resolvedId = configModule.plugin.resolveId(VIRTUAL_DOCS_CONFIG_ID);
    const addWatchFile = vi.fn();

    configModule.plugin.load.call({ addWatchFile }, resolvedId);

    expect(addWatchFile.mock.calls.map(([file]) => file)).toEqual([
      path.join(root, 'docs.json'),
      referencePath,
    ]);

    await fs.writeFile(referencePath, JSON.stringify({ pages: ['after'] }));
    await configModule.plugin.handleHotUpdate({
      file: referencePath,
      server: {
        moduleGraph: {
          getModuleById: vi.fn(),
          invalidateModule: vi.fn(),
        },
        ws: { send: vi.fn() },
      },
    });

    expect(configModule.getConfig()).toEqual({ navigation: { pages: ['after'] } });
    expect(configModule.getSourcePaths()).toEqual([path.join(root, 'docs.json'), referencePath]);
  });
});
