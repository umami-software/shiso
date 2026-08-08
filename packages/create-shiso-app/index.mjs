#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_ROOT = path.join(PACKAGE_ROOT, 'template');
const packageMetadata = JSON.parse(
  await fs.readFile(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'),
);

const HELP = `
Usage: create-shiso-app <project-directory> [options]

Options:
  --use-npm        Install dependencies with npm
  --use-pnpm       Install dependencies with pnpm
  --use-yarn       Install dependencies with Yarn
  --use-bun        Install dependencies with Bun
  --skip-install   Create the project without installing dependencies
  --disable-git    Create the project without initializing a Git repository
  -v, --version    Print the create-shiso-app version
  -h, --help       Show this help
`;

function parseArguments(argv) {
  const options = {
    projectDirectory: undefined,
    packageManager: undefined,
    skipInstall: false,
    disableGit: false,
    help: false,
    version: false,
  };

  for (const argument of argv) {
    if (argument === '--use-npm') {
      setPackageManager(options, 'npm');
    } else if (argument === '--use-pnpm') {
      setPackageManager(options, 'pnpm');
    } else if (argument === '--use-yarn') {
      setPackageManager(options, 'yarn');
    } else if (argument === '--use-bun') {
      setPackageManager(options, 'bun');
    } else if (argument === '--skip-install' || argument === '--no-install') {
      options.skipInstall = true;
    } else if (argument === '--disable-git' || argument === '--no-git') {
      options.disableGit = true;
    } else if (argument === '--help' || argument === '-h') {
      options.help = true;
    } else if (argument === '--version' || argument === '-v' || argument === '-V') {
      options.version = true;
    } else if (argument.startsWith('-')) {
      throw new Error(`Unknown option: ${argument}`);
    } else if (!options.projectDirectory) {
      options.projectDirectory = argument;
    } else {
      throw new Error(`Unexpected argument: ${argument}`);
    }
  }

  return options;
}

function setPackageManager(options, packageManager) {
  if (options.packageManager && options.packageManager !== packageManager) {
    throw new Error('Choose only one package manager.');
  }

  options.packageManager = packageManager;
}

function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent || '';

  for (const packageManager of ['pnpm', 'yarn', 'bun', 'npm']) {
    if (userAgent.startsWith(`${packageManager}/`)) {
      return packageManager;
    }
  }

  return 'pnpm';
}

function executable(command) {
  const commandShim = ['npm', 'pnpm', 'yarn'].includes(command);
  return process.platform === 'win32' && commandShim ? `${command}.cmd` : command;
}

function run(command, args, cwd, silent = false) {
  return spawnSync(executable(command), args, {
    cwd,
    env: process.env,
    stdio: silent ? 'ignore' : 'inherit',
  });
}

function packageNameFrom(directory) {
  const name = path
    .basename(directory)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[._-]+|[._-]+$/g, '');

  if (!name || name.length > 214 || name === 'node_modules' || name === 'favicon.ico') {
    throw new Error(`"${path.basename(directory)}" cannot be used as an npm package name.`);
  }

  return name;
}

async function ensureEmptyDirectory(directory) {
  let entries = [];

  try {
    entries = await fs.readdir(directory);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  if (entries.length) {
    throw new Error(`The directory ${directory} is not empty.`);
  }

  await fs.mkdir(directory, { recursive: true });
}

async function copyTemplate(directory) {
  const entries = await fs.readdir(TEMPLATE_ROOT, { withFileTypes: true });

  for (const entry of entries) {
    await fs.cp(path.join(TEMPLATE_ROOT, entry.name), path.join(directory, entry.name), {
      recursive: true,
    });
  }

  const packedGitignore = path.join(directory, '_gitignore');
  const gitignore = path.join(directory, '.gitignore');

  try {
    await fs.rename(packedGitignore, gitignore);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function setProjectName(directory, name) {
  const packagePath = path.join(directory, 'package.json');
  const projectPackage = JSON.parse(await fs.readFile(packagePath, 'utf8'));
  projectPackage.name = name;
  await fs.writeFile(packagePath, `${JSON.stringify(projectPackage, null, 2)}\n`);
}

function installDependencies(directory, packageManager) {
  console.log(`\nInstalling dependencies with ${packageManager}...\n`);
  const result = run(packageManager, ['install'], directory);

  if (result.error || result.status !== 0) {
    throw new Error(`${packageManager} install failed. The generated files were kept.`);
  }
}

function initializeGit(directory) {
  if (run('git', ['--version'], directory, true).status !== 0) {
    console.log('\nGit was not found; skipping repository initialization.');
    return false;
  }

  let result = run('git', ['init', '-b', 'main'], directory, true);

  if (result.status !== 0) {
    result = run('git', ['init'], directory, true);
  }

  if (result.status !== 0) {
    console.log('\nCould not initialize Git; the project files are still ready.');
    return false;
  }

  return true;
}

function relativeProjectPath(directory) {
  const relative = path.relative(process.cwd(), directory);
  return relative && !relative.startsWith('..') ? relative : directory;
}

function commandPath(directory) {
  return /\s/.test(directory) ? `"${directory}"` : directory;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));

  if (options.help) {
    console.log(HELP.trim());
    return;
  }

  if (options.version) {
    console.log(packageMetadata.version);
    return;
  }

  if (!options.projectDirectory) {
    throw new Error('Project directory is required. Run create-shiso-app --help for usage.');
  }

  const requestedDirectory = options.projectDirectory;
  const directory = path.resolve(requestedDirectory);
  const name = packageNameFrom(directory);
  const packageManager = options.packageManager || detectPackageManager();

  await fs.access(TEMPLATE_ROOT).catch(() => {
    throw new Error('The starter template is missing from create-shiso-app.');
  });
  await ensureEmptyDirectory(directory);

  console.log(`\nCreating a new Shiso site in ${directory}...`);
  await copyTemplate(directory);
  await setProjectName(directory, name);

  if (!options.skipInstall) {
    installDependencies(directory, packageManager);
  }

  const initializedGit = options.disableGit ? false : initializeGit(directory);
  const displayPath = relativeProjectPath(directory);
  const changeDirectory =
    path.resolve(displayPath) === process.cwd() ? '' : `  cd ${commandPath(displayPath)}\n`;
  const install = options.skipInstall ? `  ${packageManager} install\n` : '';

  console.log(`
Created ${name} with Shiso.${initializedGit ? ' A fresh Git repository was initialized.' : ''}

Next steps:

${changeDirectory}${install}  ${packageManager} dev

Edit content/docs/index.mdx to start writing.
`);
}

main().catch(error => {
  console.error(`\nError: ${error.message}\n`);
  process.exitCode = 1;
});
