import { Box, Row, Text, Code as ZenCode } from '@umami/react-zen';
import type { ReactNode } from 'react';
import { decodeHtmlEntities } from './utils';

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

export interface ParamFieldProps {
  name?: string;
  query?: string;
  path?: string;
  header?: string;
  body?: string;
  type?: string;
  required?: boolean;
  children?: ReactNode;
}

export function ParamField({
  name,
  query,
  path,
  header,
  body,
  type,
  required,
  children,
}: ParamFieldProps) {
  const label = name || query || path || header || body || 'parameter';
  const location = query ? 'query' : path ? 'path' : header ? 'header' : body ? 'body' : undefined;

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
        <ZenCode>{label}</ZenCode>
        {location ? <Badge>{location}</Badge> : null}
        {type ? (
          <Text color="muted" size="sm">
            {decodeHtmlEntities(type)}
          </Text>
        ) : null}
        {required ? <Badge tone="primary">required</Badge> : null}
      </Row>
      {children ? <Box marginTop="3">{children}</Box> : null}
    </Box>
  );
}

export function Param({ children }: { children?: ReactNode }) {
  return <ZenCode>{children}</ZenCode>;
}
