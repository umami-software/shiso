import config from '@/shiso.config.json';
import { getContent, getContentIds } from '@/server';
import { Shiso } from '@/components/Shiso';

const contentDir = './src/content/blog';

export async function generateStaticParams() {
  const ids = await getContentIds(contentDir);

  return ids.map((id: string) => ({
    id: id.split('/'),
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
  const name = (await params)?.id?.join('/');

  const content = await getContent(name, contentDir);

  return <Shiso type="blog" content={content} config={config} />;
}
