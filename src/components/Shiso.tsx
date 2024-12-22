'use client';
import { createContext, JSX } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { CodeBlock } from '@/components/CodeBlock';
import { Docs } from '@/components/Docs';
import { Blog } from '@/components/Blog';

export interface ShisoConfig {
  contentDir: string;
  docs?: { [key: string]: any };
  blog?: { [key: string]: any };
}

export interface ShisoProps {
  content: any;
  type: string;
  config: ShisoConfig;
  components?: { [key: string]: any };
  templates?: { [key: string]: any };
}

export type ShisoTemplateComponent = ({
  content,
  config,
}: {
  content: any;
  config: ShisoConfig;
}) => JSX.Element;

const defaultTemplates = {
  docs: Docs,
  blog: Blog,
};

export const ShisoContext = createContext(null as any);

export function Shiso({ content, type, config, components, templates }: ShisoProps) {
  const Component: ShisoTemplateComponent | undefined = { ...defaultTemplates, ...templates }[type];

  if (!Component) {
    return <h1>{`Component not found: ${type}`}</h1>;
  }

  return (
    <ShisoContext.Provider value={{ content, type, config }}>
      <MDXProvider components={{ ...components, pre: CodeBlock }}>
        <Component content={content} config={config} />
      </MDXProvider>
    </ShisoContext.Provider>
  );
}
