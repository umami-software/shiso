import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Docs } from '@/components/Docs';
import { getDocModule } from '@/lib/content';
import { useHead } from '@/lib/head';
import { isExternalHref } from '@/lib/paths';
import { getPageByPathname, matchRedirect } from '@/lib/site-config';

export function DocPage() {
  // pathname is base-relative: the router's basename already stripped BASE_URL.
  const { pathname } = useLocation();
  const page = getPageByPathname(pathname);
  const doc = page ? getDocModule(page.filePath) : undefined;
  // Real pages win over redirect rules; rules only apply to paths that
  // would otherwise 404.
  const redirect = page && doc ? null : matchRedirect(pathname);
  const externalRedirect = redirect && isExternalHref(redirect) ? redirect : null;

  useHead(pathname);

  useEffect(() => {
    if (externalRedirect) {
      window.location.replace(externalRedirect);
    }
  }, [externalRedirect]);

  if (redirect) {
    return externalRedirect ? null : <Navigate to={redirect} replace />;
  }

  return <Docs page={page} doc={doc || null} />;
}
