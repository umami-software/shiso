import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { DocContent } from '@/components/DocContent';
import { Menu, X } from '@/components/icons';
import { PageLinks } from '@/components/PageLinks';
import { SideNav } from '@/components/SideNav';
import { TopNav } from '@/components/TopNav';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { DOCS_PREFIX } from '@/lib/paths';
import { docsConfig, getError404 } from '@/lib/site-config';
import type { DocModule, NormalizedDocsPage } from '@/lib/types';
import styles from './Docs.module.css';

/**
 * 404 view driven by the `errors.404` config key. The standard defaults to
 * redirecting home; that happens after hydration rather than during render,
 * because the prerendered 404.html must stay a static page for hosts that
 * serve it for every unknown path.
 */
function NotFound() {
  const navigate = useNavigate();
  const { redirect, title, description } = getError404();

  useEffect(() => {
    if (redirect) {
      navigate(DOCS_PREFIX || '/', { replace: true });
    }
  }, [redirect, navigate]);

  return (
    <div className={styles.notFound}>
      <h1>{title || 'Page not found'}</h1>
      {description && <p>{renderInlineMarkdown(description)}</p>}
    </div>
  );
}

export interface DocsProps {
  page: NormalizedDocsPage | null;
  doc: DocModule | null;
}

export function Docs({ page, doc }: DocsProps) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { tabs, navigation } = docsConfig;

  // Close the mobile menu whenever the route changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!page || !doc) {
    return <NotFound />;
  }

  return (
    <div className={styles.docs}>
      <TopNav tabs={tabs} />
      <div className={styles.mobileMenu}>
        <button type="button" className={styles.menuButton} onClick={() => setMenuOpen(true)}>
          <Menu size={14} />
          Menu
        </button>
      </div>
      {menuOpen && (
        <div className={styles.overlay}>
          <button
            type="button"
            className={styles.backdrop}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className={styles.sheet}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={14} />
            </button>
            <SideNav tabs={tabs} navigation={navigation} />
          </div>
        </div>
      )}
      <div className={styles.row}>
        <div className={styles.sidenav}>
          <SideNav tabs={tabs} navigation={navigation} isSticky />
        </div>
        <DocContent page={page} doc={doc} />
        <div className={styles.pagelinks}>
          <PageLinks items={doc.toc} />
        </div>
      </div>
    </div>
  );
}
