import classNames from 'classnames';
import { Link, useLocation } from 'react-router';
import { getTabByPathname } from '@/lib/site-config';
import type { DocsTab } from '@/lib/types';

export function TopNav({ tabs }: { tabs: DocsTab[] }) {
  const { pathname } = useLocation();

  if (!tabs?.length) {
    return null;
  }

  const active = getTabByPathname(pathname);
  const selected = active?.id || tabs[0]?.id;

  return (
    <nav
      className="hidden h-[calc(100%+1px)] max-w-screen self-start items-center gap-7 overflow-x-auto text-sm [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden"
      aria-label="Sections"
    >
      {tabs.map(({ id, label, url }) => (
        <Link
          key={id}
          to={url}
          className={classNames(
            'flex h-full items-center whitespace-nowrap border-transparent border-b-2 font-medium',
            {
              'border-b-primary text-foreground': id === selected,
              'text-muted-foreground hover:text-foreground': id !== selected,
            },
          )}
          aria-current={id === selected ? 'page' : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
