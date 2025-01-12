import { Heading, Box, Text, Row, Icon, Icons } from '@umami/react-zen';
import Link from 'next/link';
import { Markdown } from './Markdown';

export interface DocsContentProps {
  section?: string;
  title?: string;
  description?: string;
  code: string;
  next?: any;
  prev?: any;
}

export function DocContent({ section, title, description, code, next, prev }: DocsContentProps) {
  return (
    <Box flexGrow={1}>
      {section && (
        <Text color="primary" weight="bold">
          {section}
        </Text>
      )}
      {title && (
        <Heading size="2" as="h1" marginY="3">
          {title}
        </Heading>
      )}
      {description && (
        <Text color="muted" size="3">
          {description}
        </Text>
      )}
      <Markdown code={code} />
      <Row justifyContent="space-between">
        <NavigationButton {...prev} isPrev />
        <NavigationButton {...next} />
      </Row>
    </Box>
  );
}

const NavigationButton = ({
  label,
  url,
  isPrev,
}: {
  label: string;
  url: string;
  isPrev?: boolean;
}) => {
  if (!url || !label) {
    return <Box />;
  }

  return (
    <Link href={url}>
      <Row alignItems="center" gap="3" marginY="3">
        {isPrev && (
          <Icon size="sm" rotate={180}>
            <Icons.Chevron />
          </Icon>
        )}
        <Text size="3" weight="bold">
          {label}
        </Text>
        {!isPrev && (
          <Icon size="sm">
            <Icons.Chevron />
          </Icon>
        )}
      </Row>
    </Link>
  );
};
