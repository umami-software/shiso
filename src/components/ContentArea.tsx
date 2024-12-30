import { Heading, Box, Text, Row, Icon, Icons } from '@umami/react-zen';
import { Markdown } from './Markdown';
import styles from './ContentArea.module.css';
import Link from 'next/link';

export interface ContentAreaProps {
  section?: string;
  title?: string;
  description?: string;
  code: string;
  next?: any;
  prev?: any;
}

export function ContentArea({ section, title, description, code, next, prev }: ContentAreaProps) {
  return (
    <Box flexGrow={1}>
      {section && (
        <Text color="primary" weight="bold">
          {section}
        </Text>
      )}
      {title && (
        <Heading size="8" as="h1">
          {title}
        </Heading>
      )}
      {description && <Text color="muted">{description}</Text>}
      <Box className={styles.content}>
        <Markdown code={code} />
      </Box>
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
