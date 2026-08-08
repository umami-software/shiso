import { Moon, Sun } from '@/components/icons';

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
    <button
      type="button"
      className="inline-flex size-8 items-center justify-center rounded-md text-foreground hover:bg-accent"
      onClick={handleClick}
      aria-label="Toggle theme"
    >
      <Sun className="dark:hidden" size={14} />
      <Moon className="hidden dark:block" size={14} />
    </button>
  );
}
