import { Moon, Sun } from '@/components/icons';
import styles from './ThemeToggle.module.css';

/**
 * Both icons are always rendered and toggled via CSS on [data-theme], so the
 * server render matches the client regardless of the user's stored theme.
 */
export function ThemeToggle() {
  const handleClick = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);

    try {
      localStorage.setItem('shiso-theme', next);
    } catch {
      // Ignore storage failures (private mode, etc).
    }
  };

  return (
    <button type="button" className={styles.button} onClick={handleClick} aria-label="Toggle theme">
      <Sun className={styles.sun} size={16} />
      <Moon className={styles.moon} size={16} />
    </button>
  );
}
