import { Link } from 'react-router';
import { Github } from '@/components/svg';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getLogo, siteName } from '@/lib/site-config';
import styles from './Header.module.css';

export function Header() {
  const logo = getLogo();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.brand}>
          {logo ? (
            <>
              <img src={logo.light} alt={siteName} className={styles.logoLight} />
              <img src={logo.dark} alt={siteName} className={styles.logoDark} />
            </>
          ) : (
            siteName
          )}
        </Link>
        <Link to="/docs">docs</Link>
      </div>
      <div className={styles.right}>
        <ThemeToggle />
        <a
          href="https://github.com/umami-software/shiso"
          target="_blank"
          rel="noreferrer"
          className={styles.github}
          aria-label="GitHub"
        >
          <Github width={16} height={16} />
        </a>
      </div>
    </header>
  );
}
