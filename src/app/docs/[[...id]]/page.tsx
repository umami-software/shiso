import { Metadata } from 'next';
import path from 'node:path';
import { Docs, getContent } from '@/components';
import config from '@/shiso.config';

const FOLDER = path.resolve(process.cwd(), './src/content/docs');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string[] }>;
}): Promise<Metadata> {
  const content = await getContent(await params, FOLDER);

  return {
    title: {
      absolute: `${content?.meta?.title} – Shiso`,
      default: 'Shiso',
    },
  };
}

export default async function ({ params }: { params: Promise<{ id: string[] }> }) {
  const content = await getContent(await params, FOLDER);

  return <Docs content={content} config={config} />;
}
