import { Metadata } from 'next';
import path from 'node:path';
import { Docs } from '@/components/docs/Docs';
import { Blog } from '@/components/blog/Blog';
import { getContent } from '@/lib/content';
import { ShisoConfig } from '@/components/Shiso';

const FOLDER = './src/content';

const components = {
  docs: Docs,
  blog: Blog,
};

export default (config: ShisoConfig) => {
  const getMetadata = (title: string) => {
    return async ({ params }: { params: Promise<{ id: string[] }> }): Promise<Metadata> => {
      const content = await getContent(await params, FOLDER);

      return {
        title: {
          absolute: `${content?.meta?.title} – ${title}`,
          default: title,
        },
      };
    };
  };

  const renderPage = (type: string) => {
    const folder = path.resolve(process.cwd(), `./src/content/${type}`);

    return async ({ params }: { params: Promise<{ id: string[] }> }) => {
      const content = await getContent(await params, folder);
      const Component = components[type];

      return Component && <Component content={content} config={config} />;
    };
  };

  return {
    getMetadata,
    renderPage,
  };
};
