import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      Built by{' '}
      <a href="https://umami.is?ref=shiso">
        <strong>umami</strong>
      </a>
    </footer>
  );
}
