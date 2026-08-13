import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(repositoryRoot, 'scripts/prepare-release.mjs');
const packageMetadata = JSON.parse(
  fs.readFileSync(path.join(repositoryRoot, 'packages/create-shiso-app/package.json'), 'utf8'),
);
const frameworkMetadata = JSON.parse(
  fs.readFileSync(path.join(repositoryRoot, 'packages/shiso/package.json'), 'utf8'),
);
const expectedTag = `create-shiso-app-v${packageMetadata.version}`;

function runReleaseCheck(tag: string, packageName?: string) {
  const args = packageName ? [script, '--package', packageName, tag] : [script, tag];
  return spawnSync(process.execPath, args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
  });
}

describe('release metadata validation', () => {
  it('accepts the tag matching the package version and changelog', () => {
    const result = runReleaseCheck(expectedTag);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`Release metadata is valid: ${expectedTag}`);
  });

  it('rejects a tag that does not match the package version', () => {
    const result = runReleaseCheck('create-shiso-app-v99.0.0');

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('does not match package version');
  });

  it('accepts the Shiso framework tag and changelog', () => {
    const tag = `shiso-v${frameworkMetadata.version}`;
    const result = runReleaseCheck(tag, 'shiso');

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`Release metadata is valid: ${tag}`);
  });
});
