import { initShiso } from '@/server';
import { Shiso } from '@/components/Shiso';
import { BlogPost } from '@/components/blog/BlogPost';
import config from '@/shiso.config.json';

const { generateMetadata, generateStaticParams, renderPage } = initShiso(config, 'blog');

export { generateMetadata, generateStaticParams };

export default renderPage(props => {
  return (
    <Shiso {...props}>
      <BlogPost />
    </Shiso>
  );
});
