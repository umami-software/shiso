import config from '@/shiso.config.json';
import { next } from '@/server';
import { Shiso } from '@/components/Shiso';

const { generateMetadata, generateStaticParams, renderPage } = next('docs', config);

export { generateMetadata, generateStaticParams };

export default renderPage(props => {
  return <Shiso {...props} />;
});
