import { ReactNode } from 'react';
import classNames from 'classnames';
import { Row, Icon, RowProps, Text } from '@umami/react-zen';
import { CircleAlert, TriangleAlert, InfoIcon, Lightbulb, CheckIcon } from '@/components/icons';
import styles from './Callout.module.css';

export interface CalloutProps extends RowProps {
  variant: 'note' | 'warning' | 'info' | 'tip' | 'check' | 'danger';
  icon?: ReactNode;
  children: ReactNode;
}

const icons = {
  note: <CircleAlert />,
  warning: <TriangleAlert />,
  info: <InfoIcon />,
  tip: <Lightbulb />,
  check: <CheckIcon />,
  danger: <TriangleAlert />,
};

export function Callout({ variant = 'note', icon, className, children }: CalloutProps) {
  return (
    <Row className={classNames(className, styles[variant])} alignItems="center" gap>
      <Icon>{icons[variant]}</Icon>
      <Text>{children}</Text>
    </Row>
  );
}

export function Note({ children }) {
  return <Callout variant="note">{children}</Callout>;
}

export function Info({ children }) {
  return <Callout variant="info">{children}</Callout>;
}

export function Warning({ children }) {
  return <Callout variant="warning">{children}</Callout>;
}

export function Check({ children }) {
  return <Callout variant="note">{children}</Callout>;
}
