import { Box, Text } from '@umami/react-zen';
import type { ReactNode } from 'react';

export interface FrameProps {
  caption?: ReactNode;
  children?: ReactNode;
}

export function Frame({ caption, children }: FrameProps) {
  return (
    <Box
      border
      borderColor="muted"
      borderRadius="lg"
      padding="4"
      marginY="4"
      backgroundColor="surface-sunken"
    >
      <Box>{children}</Box>
      {caption ? (
        <Box marginTop="3">
          <Text color="muted" size="sm">
            {caption}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}
