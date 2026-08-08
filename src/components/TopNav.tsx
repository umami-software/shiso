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
      className="flex max-w-screen gap-7 overflow-x-auto border-[var(--color-border)] border-b [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Sections"
    >
      {tabs.map(({ id, label, url }) => (
        <Link
          key={id}
          to={url}
          className={classNames(
            '-mb-px whitespace-nowrap border-transparent border-b-2 py-[0.6rem] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]',
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
