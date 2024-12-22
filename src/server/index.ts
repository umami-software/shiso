import { cache } from 'react';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';

export const parseMdx = cache(async (file: string) => {
  const postContent = await fs.readFile(file, 'utf8');
  const { data: frontmatter, content: mdxContent } = matter(postContent);

  const id = file.replace('.mdx', '').replace(/\\/g, '/').replace(/^\//, '');
  const anchors: { name: string; id: string; size: number }[] = [];
  const modifiedContent = mdxContent
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

  const code = String(
    await compile(modifiedContent, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    }),
  );

  return {
    id,
    meta: frontmatter,
    content: postContent,
    code: code,
    anchors,
  } as any;
});

export async function getContent(params: { id: string[] }, folder: string) {
  const { id = [] } = params;
  const name = id?.length ? id.join('/') : 'index';

  return parseMdx(path.resolve(folder, `${name}.mdx`));
}
