import { useEffect, useRef, useState } from 'react';
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
}: {
  page: NormalizedDocsPage;
  frontmatter?: DocFrontmatter;
  site: SiteModel;
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

  if (!href && !feedback) return null;

  return (
    <div
      className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-sm"
      data-pagefind-ignore
    >
      {feedback && (
        <div className="flex flex-col gap-2" aria-busy={status === 'pending'}>
          <fieldset
            aria-label={feedback.prompt || 'Was this page helpful?'}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="mr-2 text-muted-foreground">
              {feedback.prompt || 'Was this page helpful?'}
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
                {helpful ? feedback.helpfulLabel || 'Yes' : feedback.unhelpfulLabel || 'No'}
              </button>
            ))}
          </fieldset>
          <div role="status" aria-live="polite" className="text-muted-foreground">
            {status === 'success' && (feedback.successMessage || 'Thanks for your feedback!')}
            {status === 'error' &&
              (feedback.errorMessage || 'Could not send feedback. Please try again.')}
          </div>
        </div>
      )}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground underline underline-offset-4 hover:text-primary"
        >
          {site.editLink?.label || 'Edit this page'}
        </a>
      )}
    </div>
  );
}
