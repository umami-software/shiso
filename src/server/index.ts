import { cache } from 'react';
import recursive from 'recursive-readdir';
import { firstBy } from 'thenby';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { serialize } from 'next-mdx-remote/serialize';
import fs from 'node:fs/promises';
import path from 'node:path';

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeHighlight],
};

export const getFiles = cache(async (folder: string) => {
  const dir = path.resolve(folder);
  const files = await recursive(dir);

  return Promise.all(
    files
      .filter((file: string) => path.extname(file) === '.mdx')
      .map(async (file: string) => {
        const postContent = await fs.readFile(file, 'utf8');

        const id = file.replace('.mdx', '').replace(dir, '').replace(/\\/g, '/').replace(/^\//, '');
        const anchors: { name: string; id: string; size: number }[] = [];
        const body = postContent
          .split('\n')
          .map(line => {
            const match = line.match(/^(#+)\s+(.*)/);
            if (match) {
              const [, num, name] = match;
              const id = name.toLowerCase().replace(/\s+/g, '-');
              const size = num.length;

              anchors.push({ name, id, size });

              return `<h${size} id="${id}">${name.replace(/\{|\}/g, '')}</h${size}>`;
            }
            return line;
          })
          .join('\n');

        const { compiledSource, frontmatter } = await serialize(body, {
          mdxOptions,
          parseFrontmatter: true,
        });

        return {
          meta: frontmatter,
          id,
          content: postContent,
          code: compiledSource,
          anchors,
        } as any;
      }),
  ).then(posts => posts.sort(firstBy('date', 'desc')));
});

export async function getFile(id: string, folder: string) {
  const files = await getFiles(folder);

  return files.find(file => file?.id === id);
}

export async function getContent(params: { id: string[] }, folder: string) {
  const { id = [] } = params;
  const name = id?.length ? id.join('/') : 'index';

  return getFile(name, folder);
}
