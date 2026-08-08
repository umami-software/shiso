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
    <footer className="mt-8 border-border border-t py-8 text-muted-foreground">
      {columns.length > 0 && (
        <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(10rem,max-content))] gap-x-16 gap-y-8">
          {columns.map((column, index) => (
            <div key={column.header || index}>
              {column.header && (
                <div className="mb-3 text-sm font-semibold text-foreground">{column.header}</div>
              )}
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {column.items.map(item => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
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
        <span className="text-sm">
          Powered by{' '}
          <a
            href="https://shiso.umami.is?ref=docs-footer"
            className="font-bold hover:text-foreground"
          >
            shiso
          </a>
        </span>
        {socials.length > 0 && (
          <div className="flex items-center gap-1">
            {socials.map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
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
