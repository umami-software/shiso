import { Link, useLocation } from 'react-router';
import { ConfiguredIcon } from '@/components/ConfiguredIcon';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Search } from '@/components/Search';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TopNav } from '@/components/TopNav';
import { VersionSwitcher } from '@/components/VersionSwitcher';
import { isExternalHref } from '@/lib/paths';
import { docsHomeUrl, getScopeByPathname, hasRootStandalonePage } from '@/lib/site-config';
import type { NormalizedLink, SiteModel } from '@/lib/types';

/**
 * Header hrefs come from config, so they may point inside the site or off it.
 * In-app routes go through react-router; anything external (or explicitly
 * opened in a new tab) stays a plain anchor and triggers a document load.
 */
function isRoutedHref(href: string, target?: string): boolean {
  return href.startsWith('/') && !isExternalHref(href) && target !== '_blank';
}

function NavbarLinkItem({ link, primary = false }: { link: NormalizedLink; primary?: boolean }) {
  const iconOnly = !link.label;
  const accessibleLabel = link.ariaLabel || link.icon || link.href;

  const className = primary
    ? `ml-1 inline-flex items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 ${iconOnly ? 'size-8' : 'gap-1.5 px-3.5 py-1.5'}`
    : `inline-flex items-center rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-foreground ${iconOnly ? 'size-8 justify-center' : 'gap-1.5 px-2.5 py-1.5'}`;
  const content = (
    <>
      <ConfiguredIcon icon={link.icon} />
      {link.label}
    </>
  );

  if (isRoutedHref(link.href, link.target)) {
    return (
      <Link
        to={link.href}
        className={className}
        aria-label={iconOnly ? accessibleLabel : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      className={className}
      target={link.target}
      rel={link.target === '_blank' ? 'noreferrer' : undefined}
      aria-label={iconOnly ? accessibleLabel : undefined}
    >
      {content}
    </a>
  );
}

export function Header({ site }: { site: SiteModel }) {
  const { logo, navbar, name, appearance, labels, search } = site;
  const { pathname } = useLocation();
  // The header renders the navigation of whichever scope owns the current page.
  const docs = getScopeByPathname(pathname).docs;
  // The brand links to the standalone home page when one owns "/".
  const brandHref = logo?.href || (hasRootStandalonePage ? '/' : docsHomeUrl);
  const hasBrand = !!name || !!logo?.light || !!logo?.dark;
  const brandClassName =
    'inline-flex items-center gap-2 text-xl font-bold text-foreground tracking-[-0.03em]';
  const brandContent = (
    <>
      {logo?.light ? <img src={logo.light} alt="" className="h-6 w-auto dark:hidden" /> : null}
      {logo?.dark ? <img src={logo.dark} alt="" className="hidden h-6 w-auto dark:block" /> : null}
      {name ? <span>{name}</span> : null}
    </>
  );

  return (
    <header className="sticky top-0 z-50 h-[var(--header-height)] shrink-0 border-border border-b bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto grid h-full max-w-[1600px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-5">
        <div className="flex min-w-0 items-center gap-5 justify-self-start">
          {hasBrand ? (
            isRoutedHref(brandHref, logo?.target) ? (
              <Link to={brandHref} className={brandClassName}>
                {brandContent}
              </Link>
            ) : (
              <a
                href={brandHref}
                target={logo?.target}
                rel={logo?.target === '_blank' ? 'noreferrer' : undefined}
                className={brandClassName}
              >
                {brandContent}
              </a>
            )
          ) : null}
          <div className="hidden items-center gap-2 lg:flex">
            <VersionSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
        <div className="h-full min-w-0 justify-self-center">
          {docs.showTabs ? <TopNav docs={docs} label={labels.sections} /> : null}
        </div>
        <div className="flex min-w-0 items-center gap-2 justify-self-end">
          <Search config={search} labels={labels} />
          {navbar?.links.map(link => (
            <NavbarLinkItem key={link.href} link={link} />
          ))}
          {!appearance.strict && <ThemeToggle label={labels.toggleTheme} />}
          {navbar?.primary ? <NavbarLinkItem link={navbar.primary} primary /> : null}
        </div>
      </div>
    </header>
  );
}
