import { useEffect, useState } from 'react';
import { X } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { getBanner } from '@/lib/site-config';

const STORAGE_KEY = 'shiso-banner-dismissed';

/**
 * Site-wide banner from the `banner` config key. Dismissal stores the banner
 * content, not just a flag, so publishing a new banner shows it again.
 * The banner renders during prerender and hides after hydration when it was
 * previously dismissed.
 */
export function Banner() {
  const banner = getBanner();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!banner?.dismissible) {
      return;
    }

    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === banner.content);
    } catch {
      // Ignore storage failures (private mode, etc).
    }
  }, [banner?.dismissible, banner?.content]);

  if (!banner || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);

    try {
      localStorage.setItem(STORAGE_KEY, banner.content);
    } catch {
      // Ignore storage failures (private mode, etc).
    }
  };

  return (
    <div className="relative flex shrink-0 items-center justify-center gap-2 bg-primary px-10 py-2 text-center text-sm text-primary-foreground">
      <div className="[&_a:hover]:opacity-[0.85] [&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded-sm [&_code]:bg-black/20 [&_code]:px-1 [&_code]:py-[0.0625rem] [&_code]:text-[0.8125rem] [&_code]:font-mono">
        {renderInlineMarkdown(banner.content)}
      </div>
      {banner.dismissible && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-3 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-inherit opacity-80 hover:bg-black/15 hover:opacity-100"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
}
