import { useState } from 'react';
import { Check, ChevronRight, Copy, ExternalLink } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const [copied, setCopied] = useState(false);
  const options = resolveOptions(page);
  const primary = options[0];

  if (!primary) {
    return null;
  }

  const runOption = async (option: ResolvedOption) => {
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
    <div className="inline-flex shrink-0 items-stretch">
      <Button
        variant="outline"
        size="sm"
        className="rounded-r-none bg-card text-foreground only:rounded-md"
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
      </Button>
      {options.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-l-none border-l-0 bg-card"
                aria-label="More options"
              />
            }
          >
            <ChevronRight size={14} className="rotate-90" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            {options.map(option => (
              <DropdownMenuItem
                key={option.key}
                className="flex-col items-start gap-0.5 px-2.5 py-1.5"
                onClick={() => runOption(option)}
              >
                <div className="text-[0.85rem] font-medium text-foreground">{option.title}</div>
                {option.description && (
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
