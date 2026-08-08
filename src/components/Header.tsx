import { Link } from 'react-router';
import { Search } from '@/components/Search';
import { SocialIcon } from '@/components/SocialIcon';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TopNav } from '@/components/TopNav';
import { getIcon } from '@/lib/icons';
import { DOCS_PREFIX } from '@/lib/paths';
import { docsConfig, getAppearance, getLogo, getNavbar, siteName } from '@/lib/site-config';
import type { NavbarLink } from '@/lib/types';

const TYPE_LABELS: Record<string, string> = {
  github: 'GitHub',
  discord: 'Discord',
};

function NavbarLinkIcon({ link }: { link: NavbarLink }) {
  if (link.type) {
    return <SocialIcon platform={link.type} size={14} />;
  }

  if (link.icon) {
    const Icon = getIcon(link.icon);
    return Icon ? <Icon size={14} /> : null;
  }

  return null;
}

export function Header() {
  const logo = getLogo();
  const navbar = getNavbar();
  // logo.href wins, otherwise land on the docs home rather than a bare "/"
  // that only exists as a redirect.
  const brandHref = logo?.href || DOCS_PREFIX || '/';

  return (
    <header className="sticky top-0 z-50 h-[var(--header-height)] border-[var(--color-border)] border-b bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto grid h-full max-w-[1600px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-5">
        <div className="flex min-w-0 items-center gap-5 justify-self-start">
          <Link
            to={brandHref}
            className="text-xl font-bold text-[var(--color-text-strong)] tracking-[-0.03em]"
          >
            {logo ? (
              <>
                <img src={logo.light} alt={siteName} className="h-7 w-auto dark:hidden" />
                <img src={logo.dark} alt={siteName} className="hidden h-7 w-auto dark:block" />
              </>
            ) : (
              siteName
            )}
          </Link>
        </div>
        <TopNav tabs={docsConfig.tabs} />
        <div className="flex min-w-0 items-center gap-2 justify-self-end">
          <Search />
          {navbar?.links?.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-strong)]"
              target="_blank"
              rel="noreferrer"
            >
              <NavbarLinkIcon link={link} />
              {link.label || (link.type && TYPE_LABELS[link.type]) || null}
            </a>
          ))}
          {!getAppearance().strict && <ThemeToggle />}
          {navbar?.primary && (
            <a
              href={navbar.primary.href}
              className="ml-1 inline-flex items-center gap-1.5 rounded-[var(--radius-full)] bg-[var(--color-primary-strong)] px-3.5 py-1.5 text-sm font-semibold text-white hover:opacity-90"
              target="_blank"
              rel="noreferrer"
            >
              {navbar.primary.type !== 'button' && (
                <SocialIcon platform={navbar.primary.type} size={14} />
              )}
              {navbar.primary.label || TYPE_LABELS[navbar.primary.type] || navbar.primary.href}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
