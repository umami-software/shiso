import { type ReactNode, useId } from 'react';
import styles from './docs-components.module.css';

export interface TooltipProps {
  tip?: ReactNode;
  children?: ReactNode;
}

/**
 * CSS-only hover/focus popover so it renders correctly during prerender.
 * The trigger is focusable so the tip is reachable by keyboard.
 */
export function Tooltip({ tip, children }: TooltipProps) {
  const id = useId();

  return (
    <span className={styles.tooltip}>
      <button type="button" className={styles.tooltipTrigger} aria-describedby={id}>
        {children}
      </button>
      <span role="tooltip" id={id} className={styles.tooltipBubble}>
        {tip}
      </span>
    </span>
  );
}
