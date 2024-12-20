import { Metadata } from 'next';
import path from 'node:path';
import { Docs } from '@/components/docs/Docs';
import { Blog } from '@/components/blog/Blog';
import { getContent } from '@/lib/content';
import { ShisoConfig } from '@/components/Shiso';

const DEFAULT_CONTENT_DIR = './src/content';

const components = {
  docs: Docs,
  blog: Blog,
};

export default (config: ShisoConfig) => {
  const { contentDir = DEFAULT_CONTENT_DIR } = config || {};

  const getMetadata = ({ title }: { title: string }) => {
    return async ({ params }: { params: Promise<{ id: string[] }> }): Promise<Metadata> => {
      const content = await getContent(await params, contentDir);

      return {
        title: {
          absolute: `${content?.meta?.title} – ${title}`,
          default: title,
        },
      };
    };
  };

  const renderPage = ({ type }: { type: string }) => {
    const folder = path.resolve(process.cwd(), contentDir, type);

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
