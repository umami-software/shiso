import { siteName } from '@/lib/site-config';
import styles from './Footer.module.css';

export function Footer() {
  return <footer className={styles.footer}>{siteName}</footer>;
}
