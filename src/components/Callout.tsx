import type { ReactNode } from 'react';
import classNames from 'classnames';

export interface CalloutProps {
  variant: 'note' | 'warning' | 'info' | 'tip';
  icon?: ReactNode;
  children: ReactNode;
}

export default function Callout({ variant = 'note', icon, children }: CalloutProps) {
  return <div className={classNames('shiso-callout', `shiso-callout-${variant}`)}>{icon}{children}</div>;
}
