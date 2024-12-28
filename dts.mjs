import dts from 'dts-bundle';
import path from 'node:path';
import fs from 'node:fs/promises';

dts.bundle({
  name: '@umami/shiso',
  main: path.resolve('./types/components/index.d.ts'),
  out: path.resolve('./dist/index.d.ts'),
});

dts.bundle({
  name: '@umami/shiso/server',
  main: path.resolve('./types/server/index.d.ts'),
  out: path.resolve('./dist/server.d.ts'),
});

await fs.copyFile(path.resolve('./types/server/index.js'), path.resolve('./dist/server.js'));
