import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { rolldown } from 'rolldown';

const packageRoot = path.resolve(import.meta.dirname, '..');
const sourceRoot = path.join(packageRoot, 'src');
const outputRoot = path.join(packageRoot, 'dist');

const projectModules = new Set([
  '@/generated/last-modified',
  '@/lib/icon-registry.generated',
  '@/lib/search-index.generated',
  'virtual:shiso-docs-config',
  'virtual:shiso-config',
]);

const peerModules = new Set(['react', 'react-dom']);
const sharedModules = new Set(['@mdx-js/react']);
const runtimeAliases = new Map([
  ['use-sync-external-store/shim', path.join(sourceRoot, 'lib/vendor/use-sync-external-store.ts')],
  [
    'use-sync-external-store/shim/with-selector',
    path.join(sourceRoot, 'lib/vendor/use-sync-external-store-with-selector.ts'),
  ],
]);

function isExternal(source) {
  const packageName = source.startsWith('@')
    ? source.split('/').slice(0, 2).join('/')
    : source.split('/')[0];

  return (
    projectModules.has(source) ||
    peerModules.has(packageName) ||
    sharedModules.has(source) ||
    source === '@umami/shiso/styles.css' ||
    source.endsWith('.css')
  );
}

function resolveSourceModule(source) {
  const base = path.join(sourceRoot, source.slice(2));
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
    path.join(base, 'index.js'),
    path.join(base, 'index.jsx'),
  ];

  return candidates.find(candidate => {
    try {
      return fsSync.statSync(candidate).isFile();
    } catch {
      return false;
    }
  });
}

const bundle = await rolldown({
  input: {
    'entry-client': path.join(sourceRoot, 'entry-client.tsx'),
    'entry-server': path.join(sourceRoot, 'entry-server.tsx'),
    search: path.join(sourceRoot, 'lib/search/provider.ts'),
  },
  external: isExternal,
  plugins: [
    {
      name: 'shiso-runtime-aliases',
      resolveId(source) {
        if (runtimeAliases.has(source)) {
          return runtimeAliases.get(source);
        }

        if (projectModules.has(source)) {
          return { id: source, external: true };
        }

        if (!source.startsWith('@/')) {
          return null;
        }

        const resolved = resolveSourceModule(source);

        if (!resolved) {
          throw new Error(`Could not resolve runtime module "${source}".`);
        }

        return resolved;
      },
    },
  ],
  transform: {
    jsx: 'react-jsx',
    target: 'es2022',
  },
});

await fs.rm(outputRoot, { recursive: true, force: true });
await bundle.write({
  dir: outputRoot,
  format: 'esm',
  entryFileNames: '[name].js',
  chunkFileNames: 'chunks/[name].js',
  minify: false,
  sourcemap: false,
});
await bundle.close();

console.log(`Built the Shiso runtime at ${path.relative(process.cwd(), outputRoot)}`);
