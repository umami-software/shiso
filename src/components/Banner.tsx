import { useEffect, useState } from 'react';
import { X } from '@/components/icons';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { getBanner } from '@/lib/site-config';
import styles from './Banner.module.css';

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
    <div className={styles.banner}>
      <div className={styles.content}>{renderInlineMarkdown(banner.content)}</div>
      {banner.dismissible && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
