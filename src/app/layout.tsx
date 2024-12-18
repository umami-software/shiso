import { ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Container, Column } from '@umami/react-zen';
import { Header } from './Header';
import { Footer } from './Footer';
import '@umami/react-zen/dist/styles.css';
import 'highlight.js/styles/github-dark.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shiso',
  description: 'MDX powered content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>shiso</title>
        <link rel="icon" type="image/png" href="/leaf.png" />
      </head>
      <body className={inter.className}>
        <Suspense>
          <Container>
            <Column height="100vh" className="ohhyeaaaaa">
              <Header />
              {children}
              <Footer />
            </Column>
          </Container>
        </Suspense>
      </body>
    </html>
  );
}
