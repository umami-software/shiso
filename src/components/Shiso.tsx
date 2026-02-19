'use client';
import { MDXProvider } from '@mdx-js/react';
import * as zenComponents from '@umami/react-zen';
import type { MDXComponents } from 'mdx/types';
import { createContext, type JSX } from 'react';
import { CodeBlock } from '@/components/CodeBlock';
import { Docs } from '@/components/Docs';
import {
  Accordion,
  AccordionGroup,
  Callout,
  Card,
  CardGroup,
  Check,
  CodeGroup,
  Expandable,
  Frame,
  Info,
  Note,
  Param,
  ParamField,
  RequestExample,
  ResponseField,
  Step,
  Steps,
  Tab,
  Tabs,
  Tip,
  Tooltip,
  Warning,
} from '@/components/Mintlify';
import type { ShisoConfig, ShisoContent } from '@/lib/types';

export interface ShisoProps {
  type: string;
  config: ShisoConfig;
  content: ShisoContent | null;
  components?: MDXComponents;
  templates?: Record<string, ShisoTemplateComponent>;
}

export type ShisoTemplateComponent = ({
  content,
  config,
}: {
  content: ShisoContent | null;
  config: ShisoConfig;
}) => JSX.Element;

const defaultTemplates: Record<string, ShisoTemplateComponent> = {
  docs: Docs,
};

const shisoComponents: MDXComponents = {
  Accordion,
  AccordionGroup,
  Callout,
  Card,
  CardGroup,
  Check,
  CodeGroup,
  Expandable,
  Frame,
  Info,
  Note,
  Param,
  ParamField,
  pre: CodeBlock,
  RequestExample,
  ResponseField,
  Step,
  Steps,
  Tab,
  Tabs,
  Tip,
  Tooltip,
  Warning,
};

const defaultZenComponents = Object.fromEntries(
  Object.entries(zenComponents).filter(([name, component]) => {
    return /^[A-Z]/.test(name) && typeof component === 'function';
  }),
) as MDXComponents;

interface ShisoContextValue {
  type: string;
  config: ShisoConfig;
  content: ShisoContent | null;
  components?: MDXComponents;
  templates?: Record<string, ShisoTemplateComponent>;
}

export const ShisoContext = createContext<ShisoContextValue | null>(null);

export function Shiso({ type, config, content, components, templates }: ShisoProps) {
  const Component: ShisoTemplateComponent | undefined = { ...defaultTemplates, ...templates }[type];

  if (!Component) {
    return <h1>{`Component not found for type: ${type}`}</h1>;
  }

  return (
    <ShisoContext.Provider value={{ type, config, content, components, templates }}>
      <MDXProvider components={{ ...defaultZenComponents, ...shisoComponents, ...components }}>
        <Component config={config} content={content} />
      </MDXProvider>
    </ShisoContext.Provider>
  );
}
