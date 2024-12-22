import { Blog } from '@/components/Blog';
import config from '@/shiso.config.json';
import { getContent } from '@/server';

export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
  const content = await getContent(await params, './src/content/blog');

  return <Blog content={content} config={config} />;
}
