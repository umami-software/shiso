import type { ReactNode } from 'react';
import {
  Check as CheckIcon,
  CircleAlert,
  InfoIcon,
  Lightbulb,
  TriangleAlert,
} from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { styles } from './styles';
import { resolveIcon } from './utils';

export interface CalloutProps {
  title?: ReactNode;
  icon?: ReactNode | string;
  children?: ReactNode;
  variant?: 'note' | 'tip' | 'warning' | 'info' | 'check' | 'danger';
}

const CALLOUT_ICONS = {
  note: <InfoIcon size={14} />,
  info: <InfoIcon size={14} />,
  warning: <TriangleAlert size={14} />,
  tip: <Lightbulb size={14} />,
  check: <CheckIcon size={14} />,
  danger: <CircleAlert size={14} />,
} as const;

export function Callout({ title, icon, children, variant = 'note' }: CalloutProps) {
  return (
    <Alert role="note" className={`${styles.callout} ${styles[variant]}`}>
      <span className={styles.calloutIcon} aria-hidden={true}>
        {resolveIcon(icon) || CALLOUT_ICONS[variant]}
      </span>
      <div className={styles.calloutBody}>
        {title ? <AlertTitle className={styles.calloutTitle}>{title}</AlertTitle> : null}
        <AlertDescription className={styles.calloutDescription}>{children}</AlertDescription>
      </div>
    </Alert>
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

export function Danger({ children }: { children?: ReactNode }) {
  return <Callout variant="danger">{children}</Callout>;
}

export function WarningBanner({ children }: { children?: ReactNode }) {
  return (
    <Callout variant="warning" icon={<CircleAlert size={14} />}>
      {children}
    </Callout>
  );
}
