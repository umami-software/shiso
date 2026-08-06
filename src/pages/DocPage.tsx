import { useLocation } from 'react-router';
import { Docs } from '@/components/Docs';
import { getDocModule } from '@/lib/content';
import { useHead } from '@/lib/head';
import { getPageByPathname } from '@/lib/site-config';

export function DocPage() {
  const { pathname } = useLocation();
  const page = getPageByPathname(pathname);
  const doc = page ? getDocModule(page.filePath) : undefined;

  useHead(pathname);

  return <Docs page={page} doc={doc || null} />;
}
