import { Metadata } from 'next';
import path from 'node:path';
import config from '@/shiso.config';
import { getFile } from '@/lib/content';
import Docs from '@/components/Docs';

const FOLDER = path.resolve(process.cwd(), './src/content/blog');

export async function generateMetadata({
  params,
}: {
  params: { id: string[] };
}): Promise<Metadata> {
  const { id } = await params;
  const name = id?.length ? id.join('/') : 'index';
  const doc = await getFile(name, FOLDER);

  return {
    title: {
      absolute: `${doc?.meta?.title} – Shiso`,
      default: 'Shiso',
    },
  };
}

export default async function ({ params }: { params: Promise<{ id: string[] }> }) {
  const { id = [] } = await params;

  const name = id?.length ? id.join('/') : 'index';
  const doc = await getFile(name, FOLDER);

  if (!doc) {
    return <h1>Page not found</h1>;
  }

  return <Docs doc={doc} config={config} />;
}
