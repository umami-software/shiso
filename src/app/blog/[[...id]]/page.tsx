import config from '@/shiso.config.json';
import { next } from '@/server';
import { Shiso } from '@/components';

const { generateMetadata, generateStaticParams, renderPage } = next('blog', config);

export { generateMetadata, generateStaticParams };

export default renderPage(props => {
  return <Shiso {...props} />;
});
