import { ConfiguredIcon } from '@/components/ConfiguredIcon';
import type { NormalizedFooter } from '@/lib/types';

export function Footer({
  footer,
  className = '',
}: {
  footer: NormalizedFooter | null;
  className?: string;
}) {
  if (!footer) {
    return null;
  }

  const { socials, links: columns, attribution } = footer;

  return (
    <footer className={`mt-8 border-border border-t py-8 text-muted-foreground ${className}`}>
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
                      target={item.target}
                      rel={item.target === '_blank' ? 'noreferrer' : undefined}
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
      {attribution || socials.length > 0 ? (
        <div className="flex items-center justify-between gap-4">
          {attribution ? (
            <a
              href="https://shiso.umami.is?ref=docs-footer"
              className="text-sm hover:text-foreground"
            >
              Powered by <span className="font-bold">shiso</span>
            </a>
          ) : (
            <span />
          )}
          {socials.length > 0 && (
            <div className="flex items-center gap-1">
              {socials.map(link => {
                const iconOnly = !link.label;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.target}
                    rel={link.target === '_blank' ? 'noreferrer' : undefined}
                    className={`inline-flex min-h-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground ${iconOnly ? 'size-8' : 'gap-1.5 px-2'}`}
                    aria-label={iconOnly ? link.ariaLabel || link.icon || link.href : undefined}
                  >
                    <ConfiguredIcon icon={link.icon} />
                    {link.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </footer>
  );
}
