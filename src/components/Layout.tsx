import type { ReactNode } from 'react';
import { Banner } from '@/components/Banner';
import { Header } from '@/components/Header';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Banner />
      <Header />
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] grow flex-col px-5">
        <main className="min-h-0 grow">{children}</main>
      </div>
    </div>
  );
}
