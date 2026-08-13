declare module 'recursive-readdir';
declare module '*.json';

declare module 'virtual:shiso-docs-config' {
  import type { DocsConfig } from '@/lib/types';

  const config: DocsConfig;
  export default config;
}
