import config from '@/shiso.config.json';
import { getContent, getContentIds } from '@/server';
import { Shiso } from '@/components/Shiso';

export async function generateStaticParams() {
  const ids = await getContentIds('./src/content/docs');

  return ids.map(id => ({
    id: id.split('/'),
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
  const content = await getContent(await params, './src/content/docs');

  return <Shiso type="docs" content={content} config={config} />;
}
