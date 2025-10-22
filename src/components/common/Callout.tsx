import { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './Callout.module.css';

export interface CalloutProps {
  variant: 'note' | 'warning' | 'info' | 'tip';
  icon?: ReactNode;
  children: ReactNode;
}

export default function Callout({ variant = 'note', icon, children }: CalloutProps) {
  return (
    <div className={classNames(styles[variant])}>
      {icon}
      {children}
    </div>
  );
}
