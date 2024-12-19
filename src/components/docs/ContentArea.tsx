import { Heading, Box, Text } from '@umami/react-zen';
import Markdown from '@/components/Markdown';
import styles from './ContentArea.module.css';

export interface ContentAreaProps {
  title: string;
  body: string;
  description?: string;
  group?: string;
}

export function ContentArea({ title, description, group, body }: ContentAreaProps) {
  return (
    <Box flexGrow={1}>
      <Text color="primary" weight="bold">
        {group}
      </Text>
      <Heading size="8" as="h1">
        {title}
      </Heading>
      <Text type="muted">{description}</Text>
      <Box className={styles.content}>
        <Markdown>{body}</Markdown>
      </Box>
    </Box>
  );
}
