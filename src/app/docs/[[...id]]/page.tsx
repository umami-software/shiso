import { Docs } from '@/components/Docs';
import config from '@/shiso.config.json';
import { getContent } from '@/lib/content';

export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
  const content = await getContent(await params, './src/content/docs');

  return <Docs content={content} config={config} />;
}
