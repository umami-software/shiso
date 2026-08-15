import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

for (const relativeFile of [
  'bin/shiso.mjs',
  'docs.schema.json',
  'scripts/lib/mdast.mjs',
  'scripts/lib/slug.mjs',
  'src/entry-client.tsx',
  'src/entry-server.tsx',
  'types/client.d.ts',
  'types/search.d.ts',
  'vite.config.ts',
]) {
  await fs.access(path.join(root, relativeFile));
}

// Every public export subpath must resolve to real files, including its types.
const metadata = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));

for (const [subpath, target] of Object.entries(metadata.exports)) {
  const files = typeof target === 'string' ? [target] : Object.values(target);

  for (const file of files) {
    await fs.access(path.join(root, file)).catch(() => {
      throw new Error(`Export "${subpath}" points at missing file "${file}".`);
    });
  }
}

// Node scripts must not import raw TypeScript: that would depend on Node's
// experimental type stripping, which the supported engine range does not have.
for (const directory of ['bin', 'scripts', 'scripts/lib']) {
  const entries = await fs.readdir(path.join(root, directory), { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !/\.(mjs|js|cjs)$/.test(entry.name)) {
      continue;
    }

    const source = await fs.readFile(path.join(root, directory, entry.name), 'utf8');
    const rawTsImport = source.match(/^import\s[^\n]*from\s+'[^']+\.tsx?';?$/m);

    if (rawTsImport) {
      throw new Error(
        `${directory}/${entry.name} imports raw TypeScript: ${rawTsImport[0].trim()}`,
      );
    }
  }
}

console.log('shiso package contents are ready.');
