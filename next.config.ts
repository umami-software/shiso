import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [{ source: '/docs', destination: '/docs/index' }];
  },
};

export default nextConfig;
