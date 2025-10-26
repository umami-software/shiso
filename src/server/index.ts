import path from 'node:path';
import { ReactNode } from 'react';
import recursive from 'recursive-readdir';
import { Content, ShisoConfig } from '@/lib/types';
import { getSlug, loadMdxFiles } from '@/lib/content';
import { getNavigationDetails } from '@/lib/navigation';

export interface RenderPageProps {
  config: ShisoConfig;
  content?: Content;
  collection?: Content[];
  mdxFiles?: Content[];
}

let mdxFiles;

export function initShiso(config: ShisoConfig, type: string) {
  const { contentDir } = config;
  const typeConfig = config[type];
  const contentPath = path.resolve(contentDir, type);

  async function getFiles() {
    if (!mdxFiles) {
      mdxFiles = loadMdxFiles(contentPath);
    }

    return mdxFiles;
  }

  async function getContent(file: string) {
    const mdxFiles = await getFiles();

    const content = mdxFiles.find(f => f.path === file);

    const details = getNavigationDetails(content.slug, typeConfig.navigation);

    console.log({ details });

    return { ...content, ...details };
  }

  async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
    const name = (await params)?.slug?.join('/') || 'index';
    const file = path.join(contentPath, `${name}.mdx`);

    const content = await getContent(file);
    const { title } = config[type];

    return {
      title: {
        absolute: content?.meta?.title ? `${content?.meta?.title} – ${title}` : title,
        default: title,
      },
    };
  }

  async function generateStaticParams() {
    const files = await recursive(contentPath);

    return files.map((file: string) => ({
      slug: getSlug(file, contentPath).split('/'),
    }));
  }

  function renderPage(render: (props: RenderPageProps) => ReactNode) {
    return async ({ params }: { params: Promise<{ slug: string[] }> }) => {
      const slug = (await params)?.slug?.join('/') || 'index';
      const file = path.join(contentPath, `${slug}.mdx`);

      const content: any = await getContent(file);

      const mdxFiles = await getFiles();

      console.log('renderPage', { content, mdxFiles, slug });

      return render({ config: typeConfig, content, mdxFiles });
    };
  }

  function renderCollection(render: (props: RenderPageProps) => ReactNode) {
    return async () => {
      const files = await recursive(contentPath);

      const collection: any = await Promise.all(files.map((file: string) => getContent(file)));

      const mdxFiles = await getFiles();

      return render({ config: typeConfig, collection, mdxFiles });
    };
  }

  return { generateMetadata, generateStaticParams, renderPage, renderCollection };
}
