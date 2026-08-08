import type { ReactNode } from 'react';
import { Banner } from '@/components/Banner';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Banner />
      <div className="mx-auto max-w-[1600px] px-5">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="grow">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
}
