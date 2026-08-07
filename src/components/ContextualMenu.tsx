import { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, Copy, ExternalLink } from '@/components/icons';
import { toAbsoluteUrl, toHref } from '@/lib/paths';
import { getContextualOptions } from '@/lib/site-config';
import type { ContextualOptionObject, NormalizedDocsPage } from '@/lib/types';
import styles from './ContextualMenu.module.css';

/**
 * The contextual menu from the `contextual` config key: copy or view the page
 * as markdown, or send it to an AI assistant. The raw markdown is published
 * next to each page by the prerenderer ("/docs/setup" -> "/docs/setup.md").
 */

interface ResolvedOption {
  key: string;
  title: string;
  description: string;
  action: 'copy' | 'link';
  href?: string;
}

function aiPrompt(mdUrl: string): string {
  return `Read ${mdUrl} so I can ask questions about it.`;
}

function resolveOptions(page: NormalizedDocsPage): ResolvedOption[] {
  const mdHref = `${toHref(page.url)}.md`;
  // AI assistants need a URL they can fetch, which requires $shiso.siteUrl.
  const mdUrl = toAbsoluteUrl(page.url) ? `${toAbsoluteUrl(page.url)}.md` : undefined;

  const resolved: ResolvedOption[] = [];

  for (const option of getContextualOptions()) {
    if (typeof option !== 'string') {
      const custom = option as ContextualOptionObject;

      resolved.push({
        key: custom.title,
        title: custom.title,
        description: custom.description || '',
        action: 'link',
        href: custom.href.replaceAll('$path', page.url).replaceAll('$page', mdUrl || mdHref),
      });
      continue;
    }

    switch (option) {
      case 'copy':
        resolved.push({
          key: option,
          title: 'Copy page',
          description: 'Copy this page as Markdown',
          action: 'copy',
          href: mdHref,
        });
        break;
      case 'view':
        resolved.push({
          key: option,
          title: 'View as Markdown',
          description: 'Open this page as plain Markdown',
          action: 'link',
          href: mdHref,
        });
        break;
      case 'chatgpt':
        if (mdUrl) {
          resolved.push({
            key: option,
            title: 'Open in ChatGPT',
            description: 'Ask questions about this page',
            action: 'link',
            href: `https://chatgpt.com/?q=${encodeURIComponent(aiPrompt(mdUrl))}`,
          });
        }
        break;
      case 'claude':
        if (mdUrl) {
          resolved.push({
            key: option,
            title: 'Open in Claude',
            description: 'Ask questions about this page',
            action: 'link',
            href: `https://claude.ai/new?q=${encodeURIComponent(aiPrompt(mdUrl))}`,
          });
        }
        break;
      case 'perplexity':
        if (mdUrl) {
          resolved.push({
            key: option,
            title: 'Open in Perplexity',
            description: 'Ask questions about this page',
            action: 'link',
            href: `https://www.perplexity.ai/search?q=${encodeURIComponent(aiPrompt(mdUrl))}`,
          });
        }
        break;
    }
  }

  return resolved;
}

export function ContextualMenu({ page }: { page: NormalizedDocsPage }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const options = resolveOptions(page);
  const primary = options[0];

  useEffect(() => {
    if (!open) {
      return;
    }

    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!primary) {
    return null;
  }

  const runOption = async (option: ResolvedOption) => {
    setOpen(false);

    if (option.action === 'copy' && option.href) {
      try {
        const response = await fetch(option.href);
        // Dev serves no .md files; fall back to copying the page URL.
        const text = response.ok ? await response.text() : window.location.href;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // Clipboard unavailable; nothing sensible to do.
      }
      return;
    }

    if (option.href) {
      window.open(option.href, '_blank', 'noreferrer');
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button type="button" className={styles.primary} onClick={() => runOption(primary)}>
        {primary.action === 'copy' ? (
          copied ? (
            <Check size={14} />
          ) : (
            <Copy size={14} />
          )
        ) : (
          <ExternalLink size={14} />
        )}
        {primary.action === 'copy' && copied ? 'Copied' : primary.title}
      </button>
      {options.length > 1 && (
        <>
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setOpen(current => !current)}
            aria-expanded={open}
            aria-label="More options"
          >
            <ChevronRight size={14} className={styles.toggleIcon} />
          </button>
          {open && (
            <div className={styles.menu}>
              {options.map(option => (
                <button
                  type="button"
                  key={option.key}
                  className={styles.item}
                  onClick={() => runOption(option)}
                >
                  <div className={styles.itemTitle}>{option.title}</div>
                  {option.description && (
                    <div className={styles.itemDescription}>{option.description}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
