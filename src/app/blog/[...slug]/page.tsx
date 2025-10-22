import { next } from '@/server';
import { Shiso } from '@/components/Shiso';
import { BlogPost } from '@/components/blog/BlogPost';
import config from '@/shiso.config.json';

const { generateMetadata, generateStaticParams, renderPage } = next(config.blog);

export { generateMetadata, generateStaticParams };

export default renderPage(props => {
  return <Shiso {...props} component={<BlogPost />} />;
});
