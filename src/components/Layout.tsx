import type { ReactNode } from 'react';
import { Banner } from '@/components/Banner';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import styles from './Layout.module.css';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Banner />
      <div className={styles.container}>
        <div className={styles.column}>
          <Header />
          <main className={styles.main}>{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
}
