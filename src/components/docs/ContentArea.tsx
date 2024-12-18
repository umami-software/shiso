import { Heading, Box, Text } from '@umami/react-zen';
import Markdown from '@/components/Markdown';
import styles from './ContentArea.module.css';

export interface ContentAreaProps {
  title: string;
  body: string;
  description?: string;
  group?: string;
}

export function ContentArea({ title, description, group, body }: ContentAreaProps): JSX.Element {
  return (
    <Box className={styles.content} flexGrow={1}>
      <Text color="primary" weight="bold">
        {group}
      </Text>
      <Heading as="h1">{title}</Heading>
      <Text type="muted">{description}</Text>
      <Markdown>{body}</Markdown>
    </Box>
  );
}
