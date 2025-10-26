import fs from 'node:fs/promises';
import path from 'node:path';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import matter from 'gray-matter';
import recursive from 'recursive-readdir';

export async function loadMdxFiles(dir: string) {
  const files = await recursive(dir);

  //console.log({ files, dir });

  const pages = await Promise.all(
    files
      .map(async (file: string) => {
        if (/\.mdx?$/.test(file)) {
          const data = await parseMdxFile(file);

          if (data) {
            data['slug'] = getSlug(file, dir);
          }

          return data;
        }
      })
      .filter(Boolean),
  );

  return pages;
}

export async function parseMdxFile(file: string) {
  try {
    const postContent = await fs.readFile(file, 'utf8');

    const { data: frontmatter, content: mdxContent } = matter(postContent);

    return {
      path: file,
      meta: frontmatter,
      content: mdxContent,
      code: await getCode(mdxContent),
      anchors: getAnchors(mdxContent),
    };
  } catch {
    return null;
  }
}

export function getAnchors(content: string) {
  const anchors: { name: string; id: string; size: number }[] = [];

  content.split('\n').forEach(line => {
    const match = line.match(/^(#+)\s+(.*)/);
    if (match) {
      const [, num, name] = match;
      const size = num.length;
      const id = name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

      anchors.push({ name, id, size });
    }
  });

  return anchors;
}

export async function getCode(content: string) {
  return String(
    await compile(content, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight, rehypeSlug],
    }),
  );
}

export function getSlug(file: string, dir: string) {
  return file
    .replace('.mdx', '')
    .replace(path.dirname(dir), '')
    .replace(/\/index(\.mdx?)?$/, '')
    .replace(/\\/g, '/')
    .replace(/^\//, '');
}
