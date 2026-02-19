'use client';
import { Column, Container } from '@umami/react-zen';
import { Header } from '@/app/Header';
import { Footer } from '@/app/Footer';
import { ReactNode } from 'react';

export function App({ children }: { children: ReactNode }) {
  return (
    <Container>
      <Column minHeight="100vh">
        <Header />
        {children}
        <Footer />
      </Column>
    </Container>
  );
}
