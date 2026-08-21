import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/jetbrains-mono/400.css';
import 'highlight.js/styles/github.css';
import '@umami/shiso/styles.css';

import { MDXProvider } from '@mdx-js/react';
import { Navigate, Route, Routes } from 'react-router';
import { CodeBlock } from '@/components/CodeBlock';
import * as docsComponents from '@/components/docs/index';
import { Layout } from '@/components/Layout';
import { TooltipProvider } from '@/components/ui/tooltip';
import { docsHomeUrl, hasRootStandalonePage, siteModel, standalonePages } from '@/lib/site-config';
import { DocPage } from '@/pages/DocPage';
import { StandalonePageView } from '@/pages/StandalonePage';

const mdxComponents = {
  ...docsComponents,
  img: docsComponents.ZoomableImage,
  pre: CodeBlock,
};

export function App() {
  return (
    <TooltipProvider>
      <MDXProvider components={mdxComponents}>
        <Layout site={siteModel}>
          <Routes>
            {standalonePages.map(page => (
              <Route
                key={page.path}
                path={page.path}
                element={<StandalonePageView page={page} site={siteModel} />}
              />
            ))}
            {/* When the default scope's landing page is the root, or a
                standalone page owns "/", there is nothing to redirect. */}
            {docsHomeUrl !== '/' && !hasRootStandalonePage ? (
              <Route path="/" element={<Navigate to={docsHomeUrl} replace />} />
            ) : null}
            <Route path="*" element={<DocPage site={siteModel} />} />
          </Routes>
        </Layout>
      </MDXProvider>
    </TooltipProvider>
  );
}
