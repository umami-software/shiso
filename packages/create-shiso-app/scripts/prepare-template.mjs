import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPOSITORY_ROOT = path.resolve(PACKAGE_ROOT, '../..');
const FRAMEWORK_ROOT = path.join(REPOSITORY_ROOT, 'packages/shiso');
const DEFAULT_TEMPLATE_ROOT = path.join(PACKAGE_ROOT, 'template');
const OVERRIDES_ROOT = path.join(PACKAGE_ROOT, 'template-overrides');

const PROJECT_FILES = [
  'declarations.d.ts',
  'entry-client.tsx',
  'index.html',
  'LICENSE',
  'public/logo.svg',
  'styles.css',
  'vercel.json',
];

async function copyEntry(sourceRoot, targetRoot, entry) {
  const target = path.join(targetRoot, entry);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.cp(path.join(sourceRoot, entry), target, { recursive: true });
}

async function writeProjectPackage(templateRoot) {
  const rootPackage = JSON.parse(
    await fs.readFile(path.join(REPOSITORY_ROOT, 'package.json'), 'utf8'),
  );
  const frameworkPackage = JSON.parse(
    await fs.readFile(path.join(FRAMEWORK_ROOT, 'package.json'), 'utf8'),
  );
  const frameworkSpecifier =
    process.env.SHISO_FRAMEWORK_SPECIFIER || `^${frameworkPackage.version}`;

  const projectPackage = {
    name: 'my-shiso-docs',
    version: '0.1.0',
    private: true,
    description: 'A documentation site built with Shiso.',
    type: 'module',
    scripts: {
      dev: 'shiso dev',
      check: 'shiso check',
      build: 'shiso build',
      preview: 'shiso preview --outDir dist/client',
    },
    dependencies: {
      [frameworkPackage.name]: frameworkSpecifier,
      react: rootPackage.dependencies.react,
      'react-dom': rootPackage.dependencies['react-dom'],
    },
    devDependencies: {
      '@types/react': rootPackage.devDependencies['@types/react'],
      '@types/react-dom': rootPackage.devDependencies['@types/react-dom'],
      typescript: rootPackage.devDependencies.typescript,
    },
  };

  await fs.writeFile(
    path.join(templateRoot, 'package.json'),
    `${JSON.stringify(projectPackage, null, 2)}\n`,
  );
}

async function writeTypescriptConfig(templateRoot) {
  const config = {
    compilerOptions: {
      lib: ['dom', 'dom.iterable', 'esnext'],
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      jsx: 'react-jsx',
      target: 'es2022',
    },
    include: ['declarations.d.ts', 'entry-client.tsx'],
  };

  await fs.writeFile(
    path.join(templateRoot, 'tsconfig.json'),
    `${JSON.stringify(config, null, 2)}\n`,
  );
}

export async function prepareTemplate({ templateRoot = DEFAULT_TEMPLATE_ROOT } = {}) {
  await fs.rm(templateRoot, { recursive: true, force: true });
  await fs.mkdir(templateRoot, { recursive: true });

  for (const entry of PROJECT_FILES) {
    await copyEntry(REPOSITORY_ROOT, templateRoot, entry);
  }

  for (const entry of await fs.readdir(OVERRIDES_ROOT)) {
    await copyEntry(OVERRIDES_ROOT, templateRoot, entry);
  }

  await fs.copyFile(
    path.join(REPOSITORY_ROOT, '.gitignore'),
    path.join(templateRoot, '_gitignore'),
  );
  await writeProjectPackage(templateRoot);
  await writeTypescriptConfig(templateRoot);

  console.log(`Prepared the Shiso starter template at ${templateRoot}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  await prepareTemplate();
}
