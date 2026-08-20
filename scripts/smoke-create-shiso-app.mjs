import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE_ROOT = path.join(REPOSITORY_ROOT, 'packages/create-shiso-app');
const FRAMEWORK_ROOT = path.join(REPOSITORY_ROOT, 'packages/shiso');
const FRAMEWORK_PACKAGE = JSON.parse(
  await fs.readFile(path.join(FRAMEWORK_ROOT, 'package.json'), 'utf8'),
);

function run(command, args, cwd, env = {}) {
  const commandShim = process.platform === 'win32';
  const executable = commandShim ? process.env.ComSpec || 'cmd.exe' : command;
  const executableArgs = commandShim ? ['/d', '/s', '/c', `${command}.cmd`, ...args] : args;
  const result = spawnSync(executable, executableArgs, {
    cwd,
    env: {
      ...process.env,
      ...env,
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
const frameworkArchive = path.join(temporaryRoot, 'shiso.tgz');
const project = path.join(temporaryRoot, 'shiso-smoke-site');

try {
  console.log('\nPacking shiso...\n');
  run('pnpm', ['pack', '--out', frameworkArchive], FRAMEWORK_ROOT);

  console.log('\nPacking create-shiso-app...\n');
  run('pnpm', ['pack', '--out', archive], PACKAGE_ROOT, {
    SHISO_FRAMEWORK_SPECIFIER: `file:${frameworkArchive}`,
  });

  console.log('\nCreating a site from the packed artifact...\n');
  run('pnpm', ['dlx', archive, project, '--use-pnpm', '--disable-git'], temporaryRoot);

  const projectPackage = JSON.parse(await fs.readFile(path.join(project, 'package.json'), 'utf8'));

  if (projectPackage.name !== 'shiso-smoke-site') {
    throw new Error(
      `Expected generated package name "shiso-smoke-site", got "${projectPackage.name}".`,
    );
  }

  if (projectPackage.dependencies[FRAMEWORK_PACKAGE.name] !== `file:${frameworkArchive}`) {
    throw new Error('Generated project did not retain the packed Shiso dependency.');
  }

  for (const copiedInternal of ['src', 'scripts', 'vite.config.ts', 'docs.schema.json']) {
    await fs.access(path.join(project, copiedInternal)).then(
      () => {
        throw new Error(
          `Framework internal "${copiedInternal}" leaked into the generated project.`,
        );
      },
      error => {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      },
    );
  }

  for (const script of ['release:check', 'test:create-app']) {
    if (script in projectPackage.scripts) {
      throw new Error(`Repository-only script "${script}" leaked into the generated package.`);
    }
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
  run('pnpm', ['exec', 'shiso', 'check'], project);
  run('pnpm', ['exec', 'tsc', '--noEmit'], project);
  run('pnpm', ['build'], project);

  await Promise.all([
    assertFile(path.join(project, 'dist/client/index.html')),
    assertFile(path.join(project, 'dist/client/404.html')),
    assertFile(path.join(project, 'dist/client/docs/index.html')),
    assertFile(path.join(project, 'dist/client/docs/getting-started/index.html')),
    assertFile(path.join(project, 'dist/client/docs/getting-started.md')),
  ]);

  // Upgrade simulation: installing a newer packed framework must only touch
  // node_modules and the dependency specifier — user-owned content,
  // configuration, styles, and assets survive untouched.
  console.log('\nSimulating a framework upgrade...\n');

  const userFiles = [
    'docs.json',
    'index.html',
    'entry-client.tsx',
    'styles.css',
    'content/docs/index.mdx',
    'content/docs/getting-started.mdx',
    'public/logo.svg',
  ];
  const userFileContents = new Map();

  for (const file of userFiles) {
    userFileContents.set(file, await fs.readFile(path.join(project, file), 'utf8'));
  }

  const upgradeArchive = path.join(temporaryRoot, 'shiso-upgrade.tgz');
  run('pnpm', ['pack', '--out', upgradeArchive], FRAMEWORK_ROOT);
  run('pnpm', ['add', `${FRAMEWORK_PACKAGE.name}@file:${upgradeArchive}`], project);
  run('pnpm', ['build'], project);

  for (const file of userFiles) {
    const contents = await fs.readFile(path.join(project, file), 'utf8');

    if (contents !== userFileContents.get(file)) {
      throw new Error(`User-owned file "${file}" changed during the framework upgrade.`);
    }
  }

  const upgradedPackage = JSON.parse(await fs.readFile(path.join(project, 'package.json'), 'utf8'));

  if (upgradedPackage.dependencies[FRAMEWORK_PACKAGE.name] !== `file:${upgradeArchive}`) {
    throw new Error('Upgrade did not update the framework dependency specifier.');
  }

  await assertFile(path.join(project, 'dist/client/docs/index.html'));

  console.log('\ncreate-shiso-app smoke test passed.\n');
} finally {
  await fs.rm(temporaryRoot, { recursive: true, force: true });
}
