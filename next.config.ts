import type { NextConfig } from 'next';
import remarkGfm from 'remark-gfm';
import createMDX from '@next/mdx';
import rehypeHighlight from 'rehype-highlight';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: false,
  output: 'standalone',
  async rewrites() {
    return [
      { source: '/docs', destination: '/docs/index' },
      { source: '/blog', destination: '/blog/index' },
    ];
  },
};

export default withMDX(nextConfig);
