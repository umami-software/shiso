import fs from 'node:fs/promises';
import path from 'node:path';
import { compile } from '@mdx-js/mdx';
import matter from 'gray-matter';
import { cache, type ReactElement } from 'react';
import recursive from 'recursive-readdir';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { loadNormalizedDocsConfig } from '@/lib/docs-config';
import type {
  NormalizedDocsConfig,
  NormalizedDocsPage,
  ShisoConfig,
  ShisoContent,
  ShisoRenderProps,
} from '@/lib/types';

interface MdNode {
  type?: string;
  depth?: number;
  value?: string;
  children?: MdNode[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function walkTree(node: MdNode | undefined, visitor: (node: MdNode) => void) {
  if (!node || typeof node !== 'object') {
    return;
  }

  visitor(node);
  node.children?.forEach(child => {
    walkTree(child, visitor);
  });
}

function headingText(node: MdNode): string {
  if (!node) {
    return '';
  }

  if (typeof node.value === 'string') {
    return node.value;
  }

  return (node.children || []).map(headingText).join('');
}

function slugifyHeading(value: string, countBySlug: Map<string, number>): string {
  const base = value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const slug = base || 'section';
  const count = countBySlug.get(slug) || 0;
  countBySlug.set(slug, count + 1);
  return count ? `${slug}-${count}` : slug;
}

function collectHeadingsPlugin(anchors: { name: string; id: string; size: number }[]) {
  return () => {
    return (tree: MdNode) => {
      const countBySlug = new Map<string, number>();

      walkTree(tree, node => {
        if (node.type !== 'heading' || typeof node.depth !== 'number') {
          return;
        }

        const name = headingText(node).trim();

        if (!name) {
          return;
        }

        anchors.push({
          name,
          id: slugifyHeading(name, countBySlug),
          size: node.depth,
        });
      });
    };
  };
}

function normalizeParamSlug(slug: string): string {
  const cleaned = slug.replace(/^\/+|\/+$/g, '');

  if (!cleaned) {
    return 'index';
  }

  if (cleaned === 'index') {
    return cleaned;
  }

  return cleaned.replace(/\/index$/, '') || 'index';
}

function getPrevNext(pages: NormalizedDocsConfig['pages'], slug: string) {
  const index = pages.findIndex(page => page.slug === slug);
  const prev = index > 0 ? pages[index - 1] : null;
  const next = index >= 0 && index < pages.length - 1 ? pages[index + 1] : null;

  return {
    prev: prev ? { label: prev.label, url: prev.url } : null,
    next: next ? { label: next.label, url: next.url } : null,
  };
}

function applyDocsContext(
  content: ShisoContent | null,
  docsConfig: NormalizedDocsConfig,
  page: NormalizedDocsPage | null,
): ShisoContent | null {
  if (!content || !page) {
    return content;
  }

  const { prev, next } = getPrevNext(docsConfig.pages, page.slug);

  content.slug = page.slug;
  content.meta = {
    ...content.meta,
    title: content.meta?.title || page.label,
  };
  content.tabs = docsConfig.tabs;
  content.navigation = docsConfig.navigation;
  content.section = page.section;
  content.prev = prev;
  content.next = next;
  content.url = page.url;
  content.tabId = page.tabId;

  return content;
}

export const parseFile = cache(async (file: string): Promise<ShisoContent | null> => {
  try {
    const postContent = await fs.readFile(file, 'utf8');
    const { data: frontmatter, content: mdxContent } = matter(postContent);
    const anchors: { name: string; id: string; size: number }[] = [];

    const code = String(
      await compile(mdxContent, {
        outputFormat: 'function-body',
        remarkPlugins: [remarkGfm, collectHeadingsPlugin(anchors)],
        rehypePlugins: [rehypeHighlight, rehypeSlug],
      }),
    );

    return {
      path: file,
      meta: frontmatter,
      content: postContent,
      code,
      anchors,
    };
  } catch {
    return null;
  }
});

export function next(type: string, config: ShisoConfig) {
  const contentDir = config.contentDir || './src/content';
  const dir = path.resolve(contentDir, type);
  const sectionConfig = isRecord(config[type]) ? (config[type] as { title?: string }) : {};
  const title = sectionConfig.title || config.name || 'Shiso';
  const docsConfigPromise = type === 'docs' ? loadNormalizedDocsConfig(config) : null;

  const getContent = async (file: string) => {
    const content = await parseFile(file);

    if (content) {
      content.slug = getSlug(file, dir);
    }

    return content;
  };

  async function getDocsPage(slugValue: string) {
    if (!docsConfigPromise) {
      return { docsConfig: null, page: null };
    }

    const docsConfig = await docsConfigPromise;
    const slug = normalizeParamSlug(slugValue);
    const page = docsConfig.pageByLookupSlug[slug] || null;
    return { docsConfig, page };
  }

  async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
    const name = (await params)?.slug?.join('/') || 'index';

    if (type === 'docs') {
      const { page } = await getDocsPage(name);
      const content = page ? await parseFile(page.filePath) : null;
      const pageTitle = content?.meta?.title || page?.label;

      return {
        title: {
          absolute: pageTitle ? `${pageTitle} – ${title}` : title,
          default: title,
        },
      };
    }

    const file = path.join(dir, `${name}.mdx`);
    const content = await getContent(file);

    return {
      title: {
        absolute: content?.meta?.title ? `${content.meta.title} – ${title}` : title,
        default: title,
      },
    };
  }

  function getSlug(file: string, baseDir: string) {
    return file
      .replace(/\.mdx?$/, '')
      .replace(baseDir, '')
      .replace(/\\/g, '/')
      .replace(/^\//, '');
  }

  async function generateStaticParams() {
    if (type === 'docs') {
      const docsConfig = docsConfigPromise ? await docsConfigPromise : null;
      if (!docsConfig) {
        return [];
      }
      return docsConfig.pages.map(page => ({
        slug: page.slug === 'index' ? [] : page.slug.split('/'),
      }));
    }

    const files = await recursive(dir);
    return files.map((file: string) => ({
      slug: getSlug(file, dir).split('/'),
    }));
  }

  function renderPage(render: (props: ShisoRenderProps) => ReactElement) {
    return async ({ params }: { params: Promise<{ slug?: string[] }> }) => {
      const slug = (await params)?.slug?.join('/') || 'index';

      if (type === 'docs') {
        const { docsConfig, page } = await getDocsPage(slug);
        if (!docsConfig) {
          return render({ type, config, content: null });
        }
        const content = page ? await parseFile(page.filePath) : null;
        return render({ type, config, content: applyDocsContext(content, docsConfig, page) });
      }

      const file = path.join(dir, `${slug}.mdx`);
      const content: ShisoContent | ShisoContent[] | null = await getContent(file);
      return render({ type, config, content });
    };
  }

  function renderCollection(render: (props: ShisoRenderProps) => ReactElement) {
    return async () => {
      if (type === 'docs') {
        const docsConfig = docsConfigPromise ? await docsConfigPromise : null;
        if (!docsConfig) {
          return render({ type, config, content: [] });
        }
        const content = await Promise.all(
          docsConfig.pages.map(async page =>
            applyDocsContext(await parseFile(page.filePath), docsConfig, page),
          ),
        );
        return render({ type, config, content });
      }

      const files = await recursive(dir);
      const content = await Promise.all(files.map((file: string) => getContent(file)));
      return render({ type, config, content });
    };
  }

  return { generateMetadata, generateStaticParams, renderPage, renderCollection };
}
