import { Link } from 'react-router';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DOCS_PREFIX } from '@/lib/paths';
import { getLogo, siteName } from '@/lib/site-config';
import styles from './Header.module.css';

export function Header() {
  const logo = getLogo();
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
        <ThemeToggle />
      </div>
    </header>
  );
}
