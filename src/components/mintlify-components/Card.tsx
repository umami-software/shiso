import { Box, Column, Grid, Icon, Row, Text } from '@umami/react-zen';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronRight } from '@/components/icons';

export interface CardProps {
  title?: ReactNode;
  href?: string;
  icon?: ReactNode;
  arrow?: boolean;
  children?: ReactNode;
}

function CardContent({ title, icon, arrow, children }: Omit<CardProps, 'href'>) {
  return (
    <Box
      border
      borderColor="muted"
      borderRadius="lg"
      backgroundColor="surface-raised"
      padding="4"
      height="full"
    >
      <Row justifyContent="space-between" alignItems="start" gap="3">
        <Column gap="2">
          <Row gap="2" alignItems="center">
            {icon ? <Icon size="sm">{icon}</Icon> : null}
            {title ? (
              <Text size="lg" weight="semibold">
                {title}
              </Text>
            ) : null}
          </Row>
          {children ? <Box color="muted">{children}</Box> : null}
        </Column>
        {arrow ? (
          <Icon size="sm" color="muted">
            <ChevronRight />
          </Icon>
        ) : null}
      </Row>
    </Box>
  );
}

export function Card({ title, href, icon, arrow = !!href, children }: CardProps) {
  if (!href) {
    return (
      <CardContent title={title} icon={icon} arrow={arrow}>
        {children}
      </CardContent>
    );
  }

  return (
    <Link href={href}>
      <CardContent title={title} icon={icon} arrow={arrow}>
        {children}
      </CardContent>
    </Link>
  );
}

export interface CardGroupProps {
  children?: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export function CardGroup({ children, cols = 2 }: CardGroupProps) {
  const columns = String(Math.min(Math.max(cols, 1), 4));

  return (
    <Grid columns={{ base: '1', md: columns }} gap="4" marginY="4">
      {children}
    </Grid>
  );
}
