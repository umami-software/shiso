import { ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/jetbrains-mono/400.css';
import 'highlight.js/styles/github-dark.css';
import './tailwind.css';
import '@umami/react-zen/styles.css';
import './global.css';
import { App } from '@/app/App';

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
      <body>
        <Suspense>
          <App>{children}</App>
        </Suspense>
      </body>
    </html>
  );
}
