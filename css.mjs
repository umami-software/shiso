import fs from 'node:fs/promises';
import path from 'node:path';

async function concatFiles(filePaths, destFile) {
  const output = [];

  for (const filePath of filePaths) {
    const content = await fs.readFile(filePath, 'utf-8');
    output.push(content);
  }

  const dir = path.dirname(destFile);
  await fs.mkdir(dir, { recursive: true });

  await fs.writeFile(destFile, output.join('\n'), 'utf-8');
}

(async () => {
  await concatFiles(
    [
      './node_modules/@umami/react-zen/styles.css',
      './dist/index.css',
    ],
    './styles.css',
  );
})();
