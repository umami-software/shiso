import { Heading, Box, Text, Row, Icon } from '@umami/react-zen';
import Link from 'next/link';
import { ChevronRight } from '@/components/icons';
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
    <Box flexGrow="1">
      {section && (
        <Text color="primary" weight="bold">
          {section}
        </Text>
      )}
      {title && (
        <Box marginY="3">
          <Heading size="4xl" as="h1">
            {title}
          </Heading>
        </Box>
      )}
      {description && (
        <Text color="muted" size="lg">
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
            <ChevronRight />
          </Icon>
        )}
        <Text size="lg" weight="bold">
          {label}
        </Text>
        {!isPrev && (
          <Icon size="sm">
            <ChevronRight />
          </Icon>
        )}
      </Row>
    </Link>
  );
};
