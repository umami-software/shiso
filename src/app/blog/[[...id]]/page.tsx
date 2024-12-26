import config from '@/shiso.config.json';
import { next } from '@/server';

const { generateMetadata, generateStaticParams, renderPage } = next('blog', config);

export { generateMetadata, generateStaticParams };

export default renderPage;
