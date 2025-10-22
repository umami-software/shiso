'use client';
import * as zenComponents from '@umami/react-zen';
import { createContext, cloneElement, ReactElement } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Code } from '@umami/react-zen';
import { CodeBlock } from '@/components/common/CodeBlock';
import type { ShisoConfig, Content, ComponentProps } from '@/lib/types';

export interface ShisoProps {
  config: ShisoConfig;
  content?: Content;
  collection?: Content[];
  components?: Record<any, any>;
  component: ReactElement<ComponentProps<ShisoConfig>>;
}

const shisoComponents = {
  pre: CodeBlock,
  code: Code,
};

export const ShisoContext = createContext(null as any);

export function Shiso({ config, content, collection, components, component }: ShisoProps) {
  return (
    <ShisoContext.Provider value={{ config, content, components }}>
      <MDXProvider components={{ ...zenComponents, ...shisoComponents, ...components } as any}>
        {cloneElement(component, { config, content, collection })}
      </MDXProvider>
    </ShisoContext.Provider>
  );
}
