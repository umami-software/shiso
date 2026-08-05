import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Docs } from '@/components/Docs';
import { getDocModule } from '@/lib/content';
import { getPageByPathname, getPageTitle } from '@/lib/site-config';

export function DocPage() {
  const { pathname } = useLocation();
  const page = getPageByPathname(pathname);
  const doc = page ? getDocModule(page.filePath) : undefined;

  useEffect(() => {
    document.title = getPageTitle(doc?.frontmatter?.title || page?.label);
  }, [doc, page]);

  return <Docs page={page} doc={doc || null} />;
}
