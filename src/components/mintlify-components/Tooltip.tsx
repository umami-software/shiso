import { Box } from '@umami/react-zen';
import type { ReactNode } from 'react';

export interface TooltipProps {
  tip?: string;
  children?: ReactNode;
}

export function Tooltip({ tip, children }: TooltipProps) {
  return (
    <Box
      as="span"
      cursor="help"
      border="bottom"
      borderColor="muted"
      style={{ textDecorationStyle: 'dotted' }}
      title={tip}
    >
      {children}
    </Box>
  );
}
