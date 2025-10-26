'use client';
import * as zenComponents from '@umami/react-zen';
import { createContext, cloneElement, ReactElement } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Code } from '@umami/react-zen';
import { CodeBlock } from '@/components/common/CodeBlock';
import type { ShisoConfig, Content, ComponentProps } from '@/lib/types';
import { Callout } from '@/components';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
    },
  },
});

export interface ShisoProps {
  config: ShisoConfig;
  content?: Content;
  collection?: Content[];
  components?: Record<any, any>;
  mdxFiles?: Content[];
  children: ReactElement<ComponentProps<ShisoConfig>>;
}

const shisoComponents = {
  pre: CodeBlock,
  code: Code,
  Callout,
};

export const ShisoContext = createContext(null as any);

export function Shiso({ config, content, collection, components, mdxFiles, children }: ShisoProps) {
  return (
    <ShisoContext.Provider value={{ config, content, components, mdxFiles }}>
      <QueryClientProvider client={client}>
        <MDXProvider components={{ ...zenComponents, ...shisoComponents, ...components } as any}>
          {cloneElement(children, { config, content, collection, mdxFiles })}
        </MDXProvider>
      </QueryClientProvider>
    </ShisoContext.Provider>
  );
}
