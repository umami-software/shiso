import { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, Copy, ExternalLink } from '@/components/icons';
import { toAbsoluteUrl, toHref } from '@/lib/paths';
import { getContextualOptions } from '@/lib/site-config';
import type { ContextualOptionObject, NormalizedDocsPage } from '@/lib/types';

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
    <div className="relative inline-flex shrink-0 items-stretch" ref={containerRef}>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-l-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-[0.3rem] text-[0.8125rem] text-[var(--color-text)] only:rounded-[var(--radius-md)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-strong)]"
        onClick={() => runOption(primary)}
      >
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
            className="inline-flex items-center gap-1.5 rounded-r-[var(--radius-md)] border border-[var(--color-border)] border-l-0 bg-[var(--color-surface)] px-[0.35rem] py-[0.3rem] text-[0.8125rem] text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-strong)]"
            onClick={() => setOpen(current => !current)}
            aria-expanded={open}
            aria-label="More options"
          >
            <ChevronRight size={14} className="rotate-90" />
          </button>
          {open && (
            <div className="absolute top-[calc(100%+0.25rem)] right-0 z-50 min-w-60 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-1 shadow-[0_6px_24px_rgba(0,0,0,0.12)]">
              {options.map(option => (
                <button
                  type="button"
                  key={option.key}
                  className="block w-full rounded-[var(--radius-sm)] px-2.5 py-1.5 text-left hover:bg-[var(--color-surface-sunken)]"
                  onClick={() => runOption(option)}
                >
                  <div className="text-[0.85rem] font-medium text-[var(--color-text-strong)]">
                    {option.title}
                  </div>
                  {option.description && (
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {option.description}
                    </div>
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
