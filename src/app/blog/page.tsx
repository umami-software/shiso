import { initShiso } from '@/server';
import { Shiso } from '@/components/Shiso';
import { Blog } from '@/components/blog/Blog';
import config from '@/shiso.config.json';

const { generateMetadata, generateStaticParams, renderCollection } = initShiso(config, 'blog');

export { generateMetadata, generateStaticParams };

export default renderCollection(props => {
  return (
    <Shiso {...props}>
      <Blog />
    </Shiso>
  );
});
