import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { prepareTemplate } from '../packages/create-shiso-app/scripts/prepare-template.mjs';
import { validateConfig } from '../packages/shiso/scripts/validate-config.mjs';

const root = path.resolve(import.meta.dirname, '..');

describe('create-shiso-app template', () => {
  it('contains only user-owned project files and depends on Shiso', async () => {
    const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'shiso-template-test-'));
    const templateRoot = path.join(temporaryRoot, 'template');

    try {
      await prepareTemplate({ templateRoot });

      const projectPackage = JSON.parse(
        await readFile(path.join(templateRoot, 'package.json'), 'utf8'),
      );
      const frameworkPackage = JSON.parse(
        await readFile(path.join(root, 'packages/shiso/package.json'), 'utf8'),
      );

      expect(projectPackage.dependencies.shiso).toBe(`^${frameworkPackage.version}`);
      expect(projectPackage.scripts).toEqual({
        dev: 'shiso dev',
        check: 'shiso check',
        build: 'shiso build',
        preview: 'shiso preview --outDir dist/client',
      });

      await expect(readFile(path.join(templateRoot, 'src/App.tsx'), 'utf8')).rejects.toMatchObject({
        code: 'ENOENT',
      });
      await expect(
        readFile(path.join(templateRoot, 'scripts/prerender.mjs'), 'utf8'),
      ).rejects.toMatchObject({ code: 'ENOENT' });

      const schema = JSON.parse(
        await readFile(path.join(root, 'packages/shiso/docs.schema.json'), 'utf8'),
      );
      const config = JSON.parse(await readFile(path.join(templateRoot, 'docs.json'), 'utf8'));
      expect(validateConfig(config, schema)).toMatchObject({ valid: true, errors: [] });
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });
});
