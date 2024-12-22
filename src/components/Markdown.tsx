import React, { useState, useEffect } from 'react';
import { evaluate, run } from '@mdx-js/mdx';
import { useMDXComponents } from '@mdx-js/react';
import * as runtime from 'react/jsx-runtime';

export function Markdown({ content }: { content: any }) {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  const components = useMDXComponents();

  useEffect(() => {
    const renderMDX = async () => {
      try {
        // Evaluate the MDX content
        const result = await run(content.code, {
          ...runtime,
          baseUrl: import.meta.url,
        });

        const MDXComponent = result.default;

        setComponent(() => MDXComponent);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setComponent(null);
      }
    };

    if (content.code) {
      renderMDX();
    }
  }, [content.code]);

  if (error) {
    return <div className="text-red-500">Error rendering MDX: {error}</div>;
  }

  if (!Component) {
    return null;
  }

  return <Component components={components} />;
}
