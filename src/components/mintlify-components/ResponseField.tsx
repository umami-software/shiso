import { Box, Row, Text, Code as ZenCode } from '@umami/react-zen';
import type { ReactNode } from 'react';
import { decodeHtmlEntities } from './utils';

type MintlifyValue = string | number | boolean | null | undefined;

function Badge({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'primary' }) {
  return (
    <Box
      as="span"
      border
      borderColor={tone === 'primary' ? 'primary' : 'muted'}
      borderRadius="full"
      paddingX="2"
      paddingY="0.5"
      backgroundColor={tone === 'primary' ? 'surface-sunken' : 'surface-raised'}
    >
      <Text size="xs" weight="medium" color={tone === 'primary' ? 'primary' : 'muted'}>
        {children}
      </Text>
    </Box>
  );
}

export interface ResponseFieldProps {
  name: string;
  type?: MintlifyValue;
  required?: boolean;
  deprecated?: boolean;
  children?: ReactNode;
}

export function ResponseField({ name, type, required, deprecated, children }: ResponseFieldProps) {
  const normalizedType =
    typeof type === 'string'
      ? decodeHtmlEntities(type)
      : type === undefined || type === null
        ? undefined
        : String(type);

  return (
    <Box
      border
      borderColor="muted"
      borderRadius="lg"
      backgroundColor="surface-raised"
      padding="4"
      marginY="3"
    >
      <Row alignItems="center" gap="2" wrap="wrap">
        <ZenCode>{name}</ZenCode>
        {normalizedType ? (
          <Text color="muted" size="sm">
            {normalizedType}
          </Text>
        ) : null}
        {required ? <Badge tone="primary">required</Badge> : null}
        {deprecated ? <Badge>deprecated</Badge> : null}
      </Row>
      {children ? <Box marginTop="3">{children}</Box> : null}
    </Box>
  );
}
