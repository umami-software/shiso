import { ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@umami/react-zen/styles.css';
import 'highlight.js/styles/github-dark.css';
import './global.css';
import { App } from '@/app/App';

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
      <body className={inter.className} suppressHydrationWarning>
        <Suspense>
          <App>{children}</App>
        </Suspense>
      </body>
    </html>
  );
}
