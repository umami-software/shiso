import { Box, Icon, Row, Text } from '@umami/react-zen';
import type { ReactNode } from 'react';
import { ChevronRight } from '@/components/icons';

export interface RequestExampleProps {
  title?: ReactNode;
  children?: ReactNode;
}

export function RequestExample({ title = 'Request example', children }: RequestExampleProps) {
  return (
    <Box
      border
      borderColor="muted"
      borderRadius="lg"
      backgroundColor="surface-sunken"
      padding="4"
      marginY="4"
    >
      <Row alignItems="center" gap="2">
        <Icon size="sm">
          <ChevronRight />
        </Icon>
        <Text weight="semibold">{title}</Text>
      </Row>
      <Box marginTop="3">{children}</Box>
    </Box>
  );
}
