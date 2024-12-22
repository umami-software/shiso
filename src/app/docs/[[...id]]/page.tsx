import config from '@/shiso.config.json';
import { getContent } from '@/server';
import { Shiso } from '@/components/Shiso';

export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
  const content = await getContent(await params, './src/content/docs');

  return <Shiso type="docs" content={content} config={config} />;
}
