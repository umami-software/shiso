import config from '@/shiso.config.json';
import { next } from '@/server';
import { Shiso } from '@/components';

const { generateMetadata, generateStaticParams, renderCollection } = next('blog', config);

export { generateMetadata, generateStaticParams };

export default renderCollection(props => {
  return <Shiso {...props} />;
});
