import { ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@fontsource/jetbrains-mono/400.css';
import 'highlight.js/styles/github-dark.css';
import './tailwind.css';
import '@umami/react-zen/styles.full.css';
import './global.css';
import { App } from '@/app/App';
import docsConfig from '@/docs.json';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: docsConfig.name || 'Shiso',
  description: 'Documentation powered by Next.js and MDX.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/png" href="/leaf.png" />
      </head>
      <body>
        <Suspense>
          <App>{children}</App>
        </Suspense>
      </body>
    </html>
  );
}
