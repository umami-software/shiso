import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { DocContent } from '@/components/DocContent';
import { Menu, X } from '@/components/icons';
import { PageLinks } from '@/components/PageLinks';
import { SideNav } from '@/components/SideNav';
import { TopNav } from '@/components/TopNav';
import { docsConfig } from '@/lib/site-config';
import type { DocModule, NormalizedDocsPage } from '@/lib/types';
import styles from './Docs.module.css';

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
    return (
      <div className={styles.notFound}>
        <h1>Page not found</h1>
      </div>
    );
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
