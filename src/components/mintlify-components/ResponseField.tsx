import { Box, Row, Tag, Text, Code as ZenCode } from '@umami/react-zen';
import type { ReactNode } from 'react';
import { decodeHtmlEntities } from './utils';

type MintlifyValue = string | number | boolean | null | undefined;

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
        {required ? <Tag variant="primary">required</Tag> : null}
        {deprecated ? <Tag variant="outline">deprecated</Tag> : null}
      </Row>
      {children ? <Box marginTop="3">{children}</Box> : null}
    </Box>
  );
}
