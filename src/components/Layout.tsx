import type { ReactNode } from 'react';
import { Banner } from '@/components/Banner';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Banner />
      <Header />
      <div className="mx-auto max-w-[1600px] px-5">
        <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col">
          <main className="grow">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
}
