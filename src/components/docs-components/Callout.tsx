import type { ReactNode } from 'react';
import {
  Check as CheckIcon,
  CircleAlert,
  InfoIcon,
  Lightbulb,
  TriangleAlert,
} from '@/components/icons';
import styles from './docs-components.module.css';

export interface CalloutProps {
  title?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  variant?: 'note' | 'tip' | 'warning' | 'info' | 'check';
}

const CALLOUT_ICONS = {
  note: <InfoIcon size={14} />,
  info: <InfoIcon size={14} />,
  warning: <TriangleAlert size={14} />,
  tip: <Lightbulb size={14} />,
  check: <CheckIcon size={14} />,
} as const;

export function Callout({ title, icon, children, variant = 'note' }: CalloutProps) {
  return (
    <div className={`${styles.callout} ${styles[variant]}`}>
      {icon || CALLOUT_ICONS[variant]}
      <div className={styles.calloutBody}>
        {title ? <div className={styles.calloutTitle}>{title}</div> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function Note({ children }: { children?: ReactNode }) {
  return <Callout variant="note">{children}</Callout>;
}

export function Tip({ children }: { children?: ReactNode }) {
  return <Callout variant="tip">{children}</Callout>;
}

export function Warning({ children }: { children?: ReactNode }) {
  return <Callout variant="warning">{children}</Callout>;
}

export function Info({ children }: { children?: ReactNode }) {
  return <Callout variant="info">{children}</Callout>;
}

export function Check({ children }: { children?: ReactNode }) {
  return <Callout variant="check">{children}</Callout>;
}

export function WarningBanner({ children }: { children?: ReactNode }) {
  return (
    <Callout variant="warning" icon={<CircleAlert size={14} />}>
      {children}
    </Callout>
  );
}
