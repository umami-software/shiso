import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE_ROOT = path.join(REPOSITORY_ROOT, 'packages/create-shiso-app');

function executable(command) {
  return process.platform === 'win32' ? `${command}.cmd` : command;
}

function run(command, args, cwd) {
  const result = spawnSync(executable(command), args, {
    cwd,
    env: {
      ...process.env,
      CI: '1',
    },
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} exited with status ${result.status}`);
  }
}

async function assertFile(file) {
  const stats = await fs.stat(file);

  if (!stats.isFile()) {
    throw new Error(`Expected ${file} to be a file.`);
  }
}

const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'shiso-create-app-'));
const archive = path.join(temporaryRoot, 'create-shiso-app.tgz');
const project = path.join(temporaryRoot, 'shiso-smoke-site');

try {
  console.log('\nPacking create-shiso-app...\n');
  run('pnpm', ['pack', '--out', archive], PACKAGE_ROOT);

  console.log('\nCreating a site from the packed artifact...\n');
  run('pnpm', ['dlx', archive, project, '--use-pnpm', '--disable-git'], temporaryRoot);

  const projectPackage = JSON.parse(await fs.readFile(path.join(project, 'package.json'), 'utf8'));

  if (projectPackage.name !== 'shiso-smoke-site') {
    throw new Error(
      `Expected generated package name "shiso-smoke-site", got "${projectPackage.name}".`,
    );
  }

  if ('test:create-app' in projectPackage.scripts) {
    throw new Error('Repository-only scripts leaked into the generated package.');
  }

  await assertFile(path.join(project, '.gitignore'));
  await fs.access(path.join(project, '_gitignore')).then(
    () => {
      throw new Error('Packed _gitignore was not renamed to .gitignore.');
    },
    error => {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    },
  );

  console.log('\nBuilding the generated site...\n');
  run('pnpm', ['build'], project);

  await Promise.all([
    assertFile(path.join(project, 'dist/client/index.html')),
    assertFile(path.join(project, 'dist/client/404.html')),
    assertFile(path.join(project, 'dist/client/docs/index.html')),
    assertFile(path.join(project, 'dist/client/docs/getting-started/index.html')),
    assertFile(path.join(project, 'dist/client/docs/getting-started.md')),
  ]);

  console.log('\ncreate-shiso-app smoke test passed.\n');
} finally {
  await fs.rm(temporaryRoot, { recursive: true, force: true });
}
