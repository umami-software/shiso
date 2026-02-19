import { Box, Column, Icon, Row, Text } from '@umami/react-zen';
import type { ReactNode } from 'react';
import {
  Check as CheckIcon,
  CircleAlert,
  InfoIcon,
  Lightbulb,
  TriangleAlert,
} from '@/components/icons';

export interface CalloutProps {
  title?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  variant?: 'note' | 'tip' | 'warning' | 'info' | 'check';
}

const CALLOUT_STYLES = {
  note: {
    borderColor: 'muted',
    backgroundColor: 'surface-raised',
    color: 'strong',
    icon: <InfoIcon />,
  },
  info: {
    borderColor: 'blue-300',
    backgroundColor: 'blue-50',
    color: 'blue-800',
    icon: <InfoIcon />,
  },
  warning: {
    borderColor: 'amber-300',
    backgroundColor: 'amber-50',
    color: 'amber-900',
    icon: <TriangleAlert />,
  },
  tip: {
    borderColor: 'green-300',
    backgroundColor: 'green-50',
    color: 'green-900',
    icon: <Lightbulb />,
  },
  check: {
    borderColor: 'emerald-300',
    backgroundColor: 'emerald-50',
    color: 'emerald-900',
    icon: <CheckIcon />,
  },
} as const;

export function Callout({ title, icon, children, variant = 'note' }: CalloutProps) {
  const style = CALLOUT_STYLES[variant];

  return (
    <Box
      border
      borderRadius="lg"
      borderColor={style.borderColor}
      backgroundColor={style.backgroundColor}
      padding="4"
      marginY="4"
    >
      <Row alignItems="start" gap="3">
        <Icon color={style.color}>{icon || style.icon}</Icon>
        <Column gap="2">
          {title ? (
            <Text color={style.color} weight="semibold">
              {title}
            </Text>
          ) : null}
          <Box color={style.color}>{children}</Box>
        </Column>
      </Row>
    </Box>
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
    <Callout variant="warning" icon={<CircleAlert />}>
      {children}
    </Callout>
  );
}
