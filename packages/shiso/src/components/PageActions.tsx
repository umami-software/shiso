import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ExternalLink } from '@/components/icons';
import { toHref } from '@/lib/paths';
import type { DocFrontmatter, NormalizedDocsPage, SiteModel } from '@/lib/types';

function editHref(template: string | undefined, filePath: string): string | undefined {
  if (!template) return undefined;
  const file = filePath.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
  const href = template.replaceAll('$file', file);
  try {
    const url = new URL(href);
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.href;
  } catch {
    // Invalid frontmatter URLs should never become executable links.
  }
  return undefined;
}

export function PageActions({
  page,
  frontmatter,
  site,
  lastUpdated,
}: {
  page: NormalizedDocsPage;
  frontmatter?: DocFrontmatter;
  site: SiteModel;
  lastUpdated?: ReactNode;
}) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [rating, setRating] = useState<boolean>();
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  const feedback = frontmatter?.feedback === false ? null : site.feedback;
  const href =
    frontmatter?.editLink === false
      ? undefined
      : editHref(
          typeof frontmatter?.editLink === 'string' ? frontmatter.editLink : site.editLink?.url,
          page.filePath,
        );

  async function submit(helpful: boolean) {
    if (!feedback || request.current || status === 'success') return;
    const controller = new AbortController();
    request.current = controller;
    setRating(helpful);
    setStatus('pending');
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const endpoint = new URL(toHref(feedback.endpoint), window.location.origin);
      if (!['https:', 'http:'].includes(endpoint.protocol)) throw new Error('Invalid endpoint');
      const response = await fetch(endpoint.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          helpful,
          path: toHref(page.url),
          title: frontmatter?.title || page.label,
          language: page.language,
          version: page.version,
        }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Feedback submission failed');
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
      request.current = null;
    }
  }

  if (!href && !feedback && !lastUpdated) return null;

  return (
    <>
      {(lastUpdated || href) && (
        <div
          className="mt-8 flex items-baseline gap-4 text-sm text-muted-foreground"
          data-pagefind-ignore
        >
          {lastUpdated && <div className="min-w-0">{lastUpdated}</div>}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-right no-underline hover:text-primary"
            >
              {site.editLink?.label || site.labels.editPage}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
      {feedback && (
        <div
          className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-sm"
          aria-busy={status === 'pending'}
          data-pagefind-ignore
        >
          <fieldset
            aria-label={feedback.prompt || site.labels.feedbackPrompt}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="mr-2 text-muted-foreground">
              {feedback.prompt || site.labels.feedbackPrompt}
            </span>
            {[true, false].map(helpful => (
              <button
                key={String(helpful)}
                type="button"
                aria-pressed={rating === helpful}
                disabled={status === 'pending' || status === 'success'}
                onClick={() => void submit(helpful)}
                className="rounded-md border border-border px-3 py-1.5 text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-60 aria-pressed:border-primary aria-pressed:text-primary"
              >
                {helpful
                  ? feedback.helpfulLabel || site.labels.feedbackYes
                  : feedback.unhelpfulLabel || site.labels.feedbackNo}
              </button>
            ))}
          </fieldset>
          <div role="status" aria-live="polite" className="text-muted-foreground">
            {status === 'success' && (feedback.successMessage || site.labels.feedbackSuccess)}
            {status === 'error' && (feedback.errorMessage || site.labels.feedbackError)}
          </div>
        </div>
      )}
    </>
  );
}
