import { cache, ReactElement } from 'react';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import matter from 'gray-matter';
import recursive from 'recursive-readdir';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { ShisoConfig, ShisoRenderProps, ShisoContent } from '@/lib/types';

export const parseFile = cache(async (file: string): Promise<ShisoContent | null> => {
  try {
    const postContent = await fs.readFile(file, 'utf8');

    const { data: frontmatter, content: mdxContent } = matter(postContent);

    const anchors: { name: string; id: string; size: number }[] = [];

    mdxContent.split('\n').forEach(line => {
      const match = line.match(/^(#+)\s+(.*)/);
      if (match) {
        const [, num, name] = match;
        const id = name.toLowerCase().replace(/\s+/g, '-');
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
      code: code,
      anchors,
    };
  } catch {
    return null;
  }
});

export function next(type: string, config: ShisoConfig) {
  const dir = path.resolve(config.contentDir, type);
  const { title = 'Shiso' } = config[type];

  const getContent = async (file: string) => {
    const content = await parseFile(file);

    if (content) {
      content['slug'] = getSlug(file, dir);
    }

    return content;
  };

  async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
    const name = (await params)?.slug?.join('/') || 'index';
    const file = path.join(dir, `${name}.mdx`);

    const content = await getContent(file);

    return {
      title: {
        absolute: content?.meta?.title ? `${content?.meta?.title} – ${title}` : title,
        default: title,
      },
    };
  }

  function getSlug(file: string, dir: string) {
    return file.replace('.mdx', '').replace(dir, '').replace(/\\/g, '/').replace(/^\//, '');
  }

  async function generateStaticParams() {
    const files = await recursive(dir);

    return files.map((file: string) => ({
      slug: getSlug(file, dir).split('/'),
    }));
  }

  function renderPage(render: (props: ShisoRenderProps) => ReactElement) {
    return async ({ params }: { params: Promise<{ slug: string[] }> }) => {
      const slug = (await params)?.slug?.join('/') || 'index';
      const file = path.join(dir, `${slug}.mdx`);
      const files = await recursive(dir);

      let content: ShisoContent | ShisoContent[] | null = await getContent(file);

      if (!content && slug.endsWith('index')) {
        content = await Promise.all(files.map(file => getContent(file)));
      }

      return render({ type, config, content });
    };
  }

  return { generateMetadata, generateStaticParams, renderPage };
}
