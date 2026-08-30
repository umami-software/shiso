#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { checkContent } from '../scripts/check-content.mjs';
import { loadShisoConfig } from '../scripts/load-shiso-config.mjs';
import { validateProject } from '../scripts/validate-config.mjs';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VITE_CONFIG = path.join(PACKAGE_ROOT, 'vite.config.ts');
const VITE_BIN = path.join(
  path.dirname(fileURLToPath(import.meta.resolve('vite/package.json'))),
  'bin/vite.js',
);
const SSR_ENTRY = path.join(PACKAGE_ROOT, 'dist/entry-server.js');

const HELP = `
Usage: shiso <command> [options]

Commands:
  dev       Start the development server
  build     Validate and build the static site
  preview   Preview the production build
  check     Validate configuration, pages, links, anchors, and local assets

Options after dev, build, or preview are passed to Vite.
`;

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function check(projectRoot) {
  const result = await validateProject({ root: projectRoot });

  if (!result.valid) {
    console.error('docs.json failed schema validation:\n');
    for (const error of result.errors) {
      console.error(`  ${error}`);
    }
    process.exit(1);
  }

  console.log('docs.json is valid.');

  // Fails fast on a broken shiso.config.* before any Vite build starts.
  const shiso = await loadShisoConfig({ root: projectRoot });

  if (shiso.sourcePath) {
    console.log(`${path.basename(shiso.sourcePath)} loaded.`);
  }

  const content = await checkContent({ root: projectRoot, shiso: shiso.config });

  for (const warning of content.warnings) {
    console.warn(`  warning: ${warning}`);
  }

  if (!content.valid) {
    console.error('\nContent validation failed:\n');
    for (const error of content.errors) {
      console.error(`  ${error}`);
    }
    process.exit(1);
  }

  console.log(
    `Content is valid${content.warnings.length ? ` (${content.warnings.length} warnings)` : ''}.`,
  );
}

async function main() {
  const [command, ...options] = process.argv.slice(2);
  const projectRoot = process.cwd();

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    console.log(HELP.trim());
    return;
  }

  if (command === '--version' || command === '-v') {
    const metadata = JSON.parse(await fs.readFile(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));
    console.log(metadata.version);
    return;
  }

  if (command === 'check') {
    await check(projectRoot);
    return;
  }

  if (!['dev', 'build', 'preview'].includes(command)) {
    throw new Error(`Unknown command "${command}". Run shiso --help for usage.`);
  }

  if (command === 'build') {
    await check(projectRoot);
    run(
      process.execPath,
      [
        VITE_BIN,
        'build',
        projectRoot,
        '--config',
        VITE_CONFIG,
        ...options,
        '--outDir',
        'dist/client',
        '--emptyOutDir',
      ],
      projectRoot,
    );
    run(
      process.execPath,
      [
        VITE_BIN,
        'build',
        projectRoot,
        '--config',
        VITE_CONFIG,
        ...options,
        '--ssr',
        SSR_ENTRY,
        '--outDir',
        'dist/server',
        '--emptyOutDir',
      ],
      projectRoot,
    );
    run(process.execPath, [path.join(PACKAGE_ROOT, 'scripts/prerender.mjs')], projectRoot);
    run(process.execPath, [path.join(PACKAGE_ROOT, 'scripts/pagefind-index.mjs')], projectRoot);
    return;
  }

  run(
    process.execPath,
    [VITE_BIN, command, projectRoot, '--config', VITE_CONFIG, ...options],
    projectRoot,
  );
}

main().catch(error => {
  console.error(`\nError: ${error.message}\n`);
  process.exitCode = 1;
});
