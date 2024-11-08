import { Metadata } from 'next';
import path from 'node:path';
import { getFile } from '@/lib/content';
import Docs from '@/components/Docs';
import config from '@/app/shiso.config.json';

const FOLDER = path.resolve(process.cwd(), './src/content/docs');

export async function generateMetadata({
  params: { id = 'index' },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const doc = await getFile(id, FOLDER);

  return {
    title: {
      absolute: `${doc?.meta?.title} – Umami`,
      default: 'Umami',
    },
  };
}

export default async function ({ params: { id } }: { params: { id: string } }) {
  const doc = await getFile(id, FOLDER);
  console.log({ doc });
  if (doc) {
    let group = null;
    Object.keys(config.navigation).find(key => {
      group = config.navigation[key]?.find(group => {
        return group.pages.find(
          page => page.url === `/docs/${id}` || (page.url === `/docs` && id === 'index'),
        );
      });
      return group;
    });

    doc.group = group;
  }

  return <Docs doc={doc} config={config} />;
}
