import { MDXRemote } from 'next-mdx-remote';
import { CodeBlock } from './CodeBlock';

export default function Markdown({
  content,
  components,
  scope,
}: {
  content: any;
  components?: any;
  scope?: any;
}) {
  return (
    <MDXRemote
      compiledSource={content.code}
      frontmatter={content.frontmatter}
      scope={scope}
      components={{ ...components, pre: CodeBlock }}
    />
  );
}
