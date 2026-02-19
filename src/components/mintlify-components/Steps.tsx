import { Box, Column, Row, Text } from '@umami/react-zen';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { toElementArray } from './utils';

interface MintlifyStepChildProps {
  title?: ReactNode;
  children?: ReactNode;
}

export function Step({ children }: MintlifyStepChildProps) {
  return <>{children}</>;
}

export interface StepsProps {
  children?: ReactNode;
}

export function Steps({ children }: StepsProps) {
  const steps = useMemo(() => {
    return toElementArray<MintlifyStepChildProps>(children).map((child, index) => {
      return {
        title: child.props.title || `Step ${index + 1}`,
        content: child.props.children,
      };
    });
  }, [children]);

  if (!steps.length) {
    return null;
  }

  return (
    <Column gap="5" marginY="4">
      {steps.map((step, index) => {
        return (
          <Row key={`step-${index + 1}`} alignItems="start" gap="4">
            <Box
              width="8"
              minWidth="8"
              height="8"
              border
              borderColor="muted"
              borderRadius="full"
              backgroundColor="surface-raised"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text size="sm" weight="semibold">
                {index + 1}
              </Text>
            </Box>
            <Column gap="2" flexGrow="1">
              <Text size="lg" weight="semibold">
                {step.title}
              </Text>
              <Box>{step.content}</Box>
            </Column>
          </Row>
        );
      })}
    </Column>
  );
}
