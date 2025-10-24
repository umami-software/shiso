import { next } from '@/server';
import { Shiso } from '@/components/Shiso';
import { Docs } from '@/components/docs/Docs';
import config from '@/shiso.config.json';

const { generateMetadata, generateStaticParams, renderPage } = next(config, 'docs');

export { generateMetadata, generateStaticParams };

export default renderPage(props => {
  return (
    <Shiso {...props}>
      <Docs />
    </Shiso>
  );
});
