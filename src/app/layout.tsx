import { ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Grid, Container } from '@umami/react-zen';
import { Header } from './Header';
import { Footer } from './Footer';
import '@umami/react-zen/dist/styles.css';

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
          <Container height="100vh">
            <Grid rows="max-content 1fr max-content" height="100%">
              <Header />
              {children}
              <Footer />
            </Grid>
          </Container>
        </Suspense>
      </body>
    </html>
  );
}
