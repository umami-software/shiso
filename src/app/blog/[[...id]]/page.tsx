import shiso from '@/lib/next';
import config from '@/shiso.config.json';

const { getMetadata, renderPage } = shiso(config);

export const generateMetadata = getMetadata({ title: 'SHISO' });

export default renderPage({ type: 'blog' });
