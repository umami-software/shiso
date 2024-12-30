import { cache, ReactElement } from 'react';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';
import recursive from 'recursive-readdir';
import type { ShisoConfig } from '@/lib/types';

export const getContent = cache(async (file: string) => {
  try {
    const postContent = await fs.readFile(file, 'utf8');

    const { data: frontmatter, content: mdxContent } = matter(postContent);

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
      path: file,
      meta: frontmatter,
      content: postContent,
      code: code,
      anchors,
    };
  } catch {
    return null;
  }
});

export function next(type: string, config: ShisoConfig) {
  const dir = path.join(config.contentDir, type);
  const { title = 'Shiso' } = config[type];

  async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
    const name = (await params)?.slug?.join('/') || 'index';
    const file = path.join(dir, `${name}.mdx`);

    const content = await getContent(file);

    return {
      title: {
        absolute: `${content?.meta?.title} – ${title}`,
        default: title,
      },
    };
  }

  async function generateStaticParams() {
    const files = await recursive(dir);

    return files
      .map((file: string) => {
        return file.replace('.mdx', '').replace(dir, '').replace(/\\/g, '/').replace(/^\//, '');
      })
      .map((id: string) => ({
        id: id.split('/'),
      }));
  }

  function renderPage(
    render: ({
      type,
      content,
      config,
    }: {
      type: string;
      content: any;
      config: ShisoConfig;
    }) => ReactElement,
  ) {
    return async ({ params }: { params: Promise<{ slug: string[] }> }) => {
      const name = (await params)?.slug?.join('/') || 'index';
      const file = path.join(dir, `${name}.mdx`);

      const content = await getContent(file);

      return render({ type, content, config });
    };
  }

  return { generateMetadata, generateStaticParams, renderPage };
}
