import fs from 'node:fs/promises';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import matter from 'gray-matter';

export async function parseMdxFile(file: string) {
  try {
    const postContent = await fs.readFile(file, 'utf8');

    const { data: frontmatter, content: mdxContent } = matter(postContent);

    const anchors: { name: string; id: string; size: number }[] = [];

    mdxContent.split('\n').forEach(line => {
      const match = line.match(/^(#+)\s+(.*)/);
      if (match) {
        const [, num, name] = match;
        const id = name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '');
        const size = num.length;

        anchors.push({ name, id, size });
      }
    });

    const code = String(
      await compile(mdxContent, {
        outputFormat: 'function-body',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight, rehypeSlug],
      }),
    );

    return {
      path: file,
      meta: frontmatter,
      content: postContent,
      code,
      anchors,
    };
  } catch {
    return null;
  }
}

export function getSlug(file: string, dir: string) {
  return file.replace('.mdx', '').replace(dir, '').replace(/\\/g, '/').replace(/^\//, '');
}
