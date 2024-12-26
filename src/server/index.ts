import { cache, createElement, ReactElement } from 'react';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';
import recursive from 'recursive-readdir';
import { Shiso } from '@/components';
import type { ShisoConfig } from '@/lib/types';

function getId(name: string, folder: string) {
  return name.replace('.mdx', '').replace(folder, '').replace(/\\/g, '/').replace(/^\//, '');
}

export const getContent = cache(async (name: string = 'index', folder: string) => {
  const file = path.join(folder, `${name}.mdx`);
  const postContent = await fs.readFile(file, 'utf8');
  const { data: frontmatter, content: mdxContent } = matter(postContent);

  const id = getId(name, folder);
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

export const getContentIds = cache(async (folder: string) => {
  const dir = path.resolve(folder);
  const files = await recursive(dir);

  return files.map((file: string) => {
    return getId(file, dir);
  });
});

export function next(type: string, config: ShisoConfig) {
  const dir = path.join(config.contentDir, type);

  async function generateMetadata({ params }: { params: Promise<{ id: string[] }> }) {
    const name = (await params)?.id?.join('/');

    const content = await getContent(name, dir);

    return {
      title: {
        absolute: `${content?.meta?.title} – Shiso`,
        default: 'Shiso',
      },
    };
  }

  async function generateStaticParams() {
    const ids = await getContentIds(dir);

    return ids.map((id: string) => ({
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
    return async ({ params }: { params: Promise<{ id: string[] }> }) => {
      const name = (await params)?.id?.join('/');

      const content = await getContent(name, dir);

      return render({ type, content, config });
    };
  }

  return { generateMetadata, generateStaticParams, renderPage };
}
