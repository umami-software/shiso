import '@fontsource-variable/inter/index.css';
import '@fontsource/jetbrains-mono/400.css';
import '@umami/shiso/styles.css';

import { MDXProvider } from '@mdx-js/react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { CodeBlock } from '@/components/CodeBlock';
import * as docsComponents from '@/components/docs/index';
import { Layout } from '@/components/Layout';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LabelContext } from '@/lib/label-context';
import {
  docsHomeUrl,
  getSiteModelByPathname,
  hasRootStandalonePage,
  standalonePages,
} from '@/lib/site-config';
import { DocPage } from '@/pages/DocPage';
import { StandalonePageView } from '@/pages/StandalonePage';

// Runtime helpers are public exports, but cannot be rendered as MDX components.
const {
  mermaidSource: _mermaidSource,
  usePanelContent: _usePanelContent,
  useSetPanelContent: _useSetPanelContent,
  ...mdxDocsComponents
} = docsComponents;

const mdxComponents = {
  ...mdxDocsComponents,
  img: docsComponents.ZoomableImage,
  pre: CodeBlock,
};

export function App() {
  const { pathname } = useLocation();
  const siteModel = getSiteModelByPathname(pathname);
  return (
    <LabelContext.Provider value={siteModel.labels}>
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
    </LabelContext.Provider>
  );
}
