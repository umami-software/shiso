import config from '@/shiso.config.json';
import { getContent, getContentIds } from '@/server';
import { Shiso } from '@/components/Shiso';

const contentDir = './src/content/docs';

export async function generateStaticParams() {
  const ids = await getContentIds(contentDir);

  return ids.map((id: string) => ({
    id: id.split('/'),
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
  const name = (await params)?.id?.join('/');

  const content = await getContent(name, contentDir);

  return <Shiso type="docs" content={content} config={config} />;
}
