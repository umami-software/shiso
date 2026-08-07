import { isKnownPlatform, SocialIcon } from '@/components/SocialIcon';
import { getFooter, siteName } from '@/lib/site-config';
import styles from './Footer.module.css';

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
    <footer className={styles.footer}>
      {columns.length > 0 && (
        <div className={styles.columns}>
          {columns.map((column, index) => (
            <div key={column.header || index} className={styles.column}>
              {column.header && <div className={styles.columnHeader}>{column.header}</div>}
              <ul className={styles.columnList}>
                {column.items.map(item => (
                  <li key={item.href}>
                    <a href={item.href} className={styles.columnLink}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <div className={styles.bottom}>
        <span className={styles.name}>{siteName}</span>
        {socials.length > 0 && (
          <div className={styles.socials}>
            {socials.map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                className={styles.socialLink}
                target="_blank"
                rel="noreferrer"
                aria-label={platformLabel(platform)}
              >
                <SocialIcon platform={platform} />
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
