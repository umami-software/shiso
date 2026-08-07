import { Link } from 'react-router';
import { Search } from '@/components/Search';
import { SocialIcon } from '@/components/SocialIcon';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getIcon } from '@/lib/icons';
import { DOCS_PREFIX } from '@/lib/paths';
import { getAppearance, getLogo, getNavbar, siteName } from '@/lib/site-config';
import type { NavbarLink } from '@/lib/types';
import styles from './Header.module.css';

const TYPE_LABELS: Record<string, string> = {
  github: 'GitHub',
  discord: 'Discord',
};

function NavbarLinkIcon({ link }: { link: NavbarLink }) {
  if (link.type) {
    return <SocialIcon platform={link.type} size={16} />;
  }

  if (link.icon) {
    const Icon = getIcon(link.icon);
    return Icon ? <Icon size={16} /> : null;
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
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to={brandHref} className={styles.brand}>
          {logo ? (
            <>
              <img src={logo.light} alt={siteName} className={styles.logoLight} />
              <img src={logo.dark} alt={siteName} className={styles.logoDark} />
            </>
          ) : (
            siteName
          )}
        </Link>
      </div>
      <div className={styles.right}>
        <Search />
        {navbar?.links?.map(link => (
          <a
            key={link.href}
            href={link.href}
            className={styles.navLink}
            target="_blank"
            rel="noreferrer"
          >
            <NavbarLinkIcon link={link} />
            {link.label || (link.type && TYPE_LABELS[link.type]) || null}
          </a>
        ))}
        {!getAppearance().strict && <ThemeToggle />}
        {navbar?.primary && (
          <a href={navbar.primary.href} className={styles.primary} target="_blank" rel="noreferrer">
            {navbar.primary.type !== 'button' && (
              <SocialIcon platform={navbar.primary.type} size={16} />
            )}
            {navbar.primary.label || TYPE_LABELS[navbar.primary.type] || navbar.primary.href}
          </a>
        )}
      </div>
    </header>
  );
}
