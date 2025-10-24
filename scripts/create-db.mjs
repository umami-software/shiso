import recursive from 'recursive-readdir';

const files = await recursive(dir);

console.log({ files });

return Promise.all(
  files
    .map(async (file) => {
      if (/\.mdx?$/.test(file)) {
        return await parseMdxFile(file, '');
      }
    })
    .filter(Boolean),
);
