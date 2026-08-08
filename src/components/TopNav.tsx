import classNames from 'classnames';
import { Link, useLocation } from 'react-router';
import type { DocsTab } from '@/lib/types';

export function TopNav({ tabs }: { tabs: DocsTab[] }) {
  const { pathname } = useLocation();

  if (!tabs?.length) {
    return null;
  }

  const active = [...tabs]
    .sort((a, b) => b.url.length - a.url.length)
    .find(({ url }) => pathname === url || pathname.startsWith(`${url}/`));
  const selected = active?.id || tabs[0]?.id;

  return (
    <nav
      className="hidden h-full max-w-screen items-center gap-7 overflow-x-auto [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden"
      aria-label="Sections"
    >
      {tabs.map(({ id, label, url }) => (
        <Link
          key={id}
          to={url}
          className={classNames(
            'flex h-full items-center whitespace-nowrap border-transparent border-b-2 font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]',
            {
              'border-b-[var(--color-primary)] text-[var(--color-text-strong)]': id === selected,
            },
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
