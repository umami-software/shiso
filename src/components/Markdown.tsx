import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Link, { LinkProps } from 'next/link';
import { CodeBlock } from '@/components/docs/CodeBlock';

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
};

const components = {
  a: (props: any) => <Link {...(props as LinkProps)} />,
  pre: CodeBlock,
};

export default function Markdown({ children }) {
  return <MDXRemote source={children as any} components={components} options={options} />;
}
