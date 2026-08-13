import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { prepareTemplate } from '../packages/create-shiso-app/scripts/prepare-template.mjs';
import { validateConfig } from '../scripts/validate-config.mjs';

const root = path.resolve(import.meta.dirname, '..');

describe('create-shiso-app template', () => {
  it('uses the repository config schema and loading pipeline', async () => {
    const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'shiso-template-test-'));
    const templateRoot = path.join(temporaryRoot, 'template');

    try {
      await prepareTemplate({ templateRoot });

      for (const relativeFile of [
        'docs.schema.json',
        'scripts/load-docs-config.mjs',
        'scripts/validate-config.mjs',
        'scripts/vite-docs-config.mjs',
      ]) {
        const [repositoryFile, templateFile] = await Promise.all([
          readFile(path.join(root, relativeFile), 'utf8'),
          readFile(path.join(templateRoot, relativeFile), 'utf8'),
        ]);
        expect(templateFile, `${relativeFile} differs in the starter template`).toBe(
          repositoryFile,
        );
      }

      const schema = JSON.parse(
        await readFile(path.join(templateRoot, 'docs.schema.json'), 'utf8'),
      );
      const config = JSON.parse(await readFile(path.join(templateRoot, 'docs.json'), 'utf8'));
      expect(validateConfig(config, schema)).toMatchObject({ valid: true, errors: [] });
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });
});
