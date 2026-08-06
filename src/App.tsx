import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/jetbrains-mono/400.css';
import 'highlight.js/styles/github-dark.css';
import '@/styles/tokens.css';
import '@/styles/global.css';

import { MDXProvider } from '@mdx-js/react';
import { Navigate, Route, Routes } from 'react-router';
import { CodeBlock } from '@/components/CodeBlock';
import * as docsComponents from '@/components/docs-components';
import { Layout } from '@/components/Layout';
import { DOCS_PREFIX } from '@/lib/paths';
import { DocPage } from '@/pages/DocPage';

const mdxComponents = {
  ...docsComponents,
  pre: CodeBlock,
};

export function App() {
  return (
    <MDXProvider components={mdxComponents}>
      <Layout>
        <Routes>
          {/* When docs are mounted at the site root there is nothing to redirect. */}
          {DOCS_PREFIX ? <Route path="/" element={<Navigate to={DOCS_PREFIX} replace />} /> : null}
          <Route path="*" element={<DocPage />} />
        </Routes>
      </Layout>
    </MDXProvider>
  );
}
