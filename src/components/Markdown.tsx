import { runSync } from '@mdx-js/mdx';
import { useMDXComponents } from '@mdx-js/react';
import * as runtime from 'react/jsx-runtime';

const parseMdx = (code: string) => {
  try {
    const result = runSync(code, {
      ...runtime,
      baseUrl: import.meta.url,
    });

    return { Component: result.default };
  } catch (err: any) {
    return { error: err.message };
  }
};

export function Markdown({ content }: { content: any }) {
  const components = useMDXComponents();
  const { Component, error } = parseMdx(content.code);

  if (error) {
    return <h1>Error rendering MDX: {error}</h1>;
  }

  if (!Component) {
    return null;
  }

  return <Component components={components} />;
}
