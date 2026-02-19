import { Shiso } from '@/components/Shiso';
import { next } from '@/server';
import config from '@/shiso.config.json';

const { generateMetadata, generateStaticParams, renderPage } = next('docs', config);

export { generateMetadata, generateStaticParams };

export default renderPage(props => {
  return <Shiso {...props} />;
});

