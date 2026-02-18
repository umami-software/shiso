'use client';
import { createContext, JSX } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Code } from '@umami/react-zen';
import { CodeBlock } from '@/components/CodeBlock';
import { Docs } from '@/components/Docs';
import type { ShisoConfig, ShisoContent } from '@/lib/types';

export interface ShisoProps {
  type: string;
  config: ShisoConfig;
  content: ShisoContent;
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
};

const shisoComponents = {
  pre: CodeBlock,
  code: Code,
};

export const ShisoContext = createContext(null as any);

export function Shiso({ type, config, content, components, templates }: ShisoProps) {
  const Component: ShisoTemplateComponent | undefined = { ...defaultTemplates, ...templates }[type];

  if (!Component) {
    return <h1>{`Component not found for type: ${type}`}</h1>;
  }

  return (
    <ShisoContext.Provider value={{ type, config, content, components, templates }}>
      <MDXProvider components={{ ...shisoComponents, ...components }}>
        <Component config={config} content={content} />
      </MDXProvider>
    </ShisoContext.Provider>
  );
}
