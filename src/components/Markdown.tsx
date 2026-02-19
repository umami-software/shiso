import { runSync } from '@mdx-js/mdx';
import { useMDXComponents } from '@mdx-js/react';
import { Box } from '@umami/react-zen';
import * as runtime from 'react/jsx-runtime';

const parseMdx = (code: string) => {
  try {
    const result = runSync(code, {
      ...runtime,
      baseUrl: import.meta.url,
    });

    return { Component: result.default };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Unknown MDX rendering error' };
  }
};

export function Markdown({ code }: { code: string }) {
  const components = useMDXComponents();
  const { Component, error } = parseMdx(code);

  if (error) {
    return <h1>Error rendering MDX: {error}</h1>;
  }

  if (!Component) {
    return null;
  }

  return (
    <Box marginBottom="10">
      <Component components={components} />
    </Box>
  );
}
