import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

for (const relativeFile of [
  'bin/shiso.mjs',
  'docs.schema.json',
  'src/entry-client.tsx',
  'src/entry-server.tsx',
  'types/client.d.ts',
  'types/search.d.ts',
  'vite.config.ts',
]) {
  await fs.access(path.join(root, relativeFile));
}

console.log('shiso package contents are ready.');
