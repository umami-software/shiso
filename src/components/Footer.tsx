import { isKnownPlatform, SocialIcon } from '@/components/SocialIcon';
import { getFooter } from '@/lib/site-config';

/** "hacker-news" -> "Hacker News", for accessible labels on icon-only links. */
function platformLabel(platform: string): string {
  return platform
    .split('-')
    .map(word => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');
}

export function Footer() {
  const footer = getFooter();
  const socials = Object.entries(footer?.socials || {}).filter(([platform]) =>
    isKnownPlatform(platform),
  );
  const columns = footer?.links || [];

  return (
    <footer className="mt-8 border-[var(--color-border)] border-t py-8 text-[var(--color-text-muted)]">
      {columns.length > 0 && (
        <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(10rem,max-content))] gap-x-16 gap-y-8">
          {columns.map((column, index) => (
            <div key={column.header || index}>
              {column.header && (
                <div className="mb-3 text-sm font-semibold text-[var(--color-text-strong)]">
                  {column.header}
                </div>
              )}
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {column.items.map(item => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm">Powered by Shiso</span>
        {socials.length > 0 && (
          <div className="flex items-center gap-1">
            {socials.map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                className="inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-strong)]"
                target="_blank"
                rel="noreferrer"
                aria-label={platformLabel(platform)}
              >
                <SocialIcon platform={platform} size={14} />
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
