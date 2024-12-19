import shiso from '@/lib/next';
import config from '@/shiso.config.json';

const { getMetadata, renderPage } = shiso(config);

export const generateMetadata = getMetadata('SHISO');

export default renderPage('blog');
