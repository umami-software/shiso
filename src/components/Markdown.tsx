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

export function Markdown({ code }: { code: any }) {
  const components = useMDXComponents();
  const { Component, error } = parseMdx(code);

  if (error) {
    return <h1>Error rendering MDX: {error}</h1>;
  }

  if (!Component) {
    return null;
  }

  return (
    <div className="markdown">
      <Component components={components} />
    </div>
  );
}
