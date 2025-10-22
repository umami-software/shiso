import path from 'node:path';
import { ReactNode } from 'react';
import recursive from 'recursive-readdir';
import { Content, ShisoConfig } from '@/lib/types';
import { parseMdxFile, getSlug } from '@/lib/content';

export interface RenderPageProps {
  config: ShisoConfig;
  content?: Content;
  collection?: Content[];
}

export function next(config: ShisoConfig) {
  const dir = path.resolve(config.contentDir);

  const getContent = async (file: string) => {
    const files = await recursive(dir);

    console.log({ files });

    const content = await parseMdxFile(file);

    if (content) {
      content['slug'] = getSlug(file, path.resolve(config.contentDir));
    }

    return content;
  };

  async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
    const name = (await params)?.slug?.join('/') || 'index';
    const file = path.join(dir, `${name}.mdx`);

    const content = await getContent(file);
    const { title } = config;

    return {
      title: {
        absolute: content?.meta?.title ? `${content?.meta?.title} – ${title}` : title,
        default: title,
      },
    };
  }

  async function generateStaticParams() {
    const files = await recursive(dir);

    return files.map((file: string) => ({
      slug: getSlug(file, dir).split('/'),
    }));
  }

  function renderPage(render: (props: RenderPageProps) => ReactNode) {
    return async ({ params }: { params: Promise<{ slug: string[] }> }) => {
      const slug = (await params)?.slug?.join('/') || 'index';
      const file = path.join(dir, `${slug}.mdx`);

      const content: any = await getContent(file);

      return render({ config, content });
    };
  }

  function renderCollection(render: (props: RenderPageProps) => ReactNode) {
    return async () => {
      const files = await recursive(dir);
      console.log({ files });

      const collection: any = await Promise.all(files.map((file: string) => getContent(file)));

      return render({ config, collection });
    };
  }

  return { generateMetadata, generateStaticParams, renderPage, renderCollection };
}
