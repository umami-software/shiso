import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import { useMDXComponents } from '@/mdx-components';

const options = {
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [rehypeHighlight],
  },
};

export default function Markdown({ children }) {
  const mdxComponents = useMDXComponents({});

  return <MDXRemote source={children as any} components={{ ...mdxComponents }} options={options} />;
}
