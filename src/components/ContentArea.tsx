import { Heading, Box, Text } from '@umami/react-zen';
import { Markdown } from './Markdown';
import styles from './ContentArea.module.css';

export interface ContentAreaProps {
  content: { [key: string]: any };
}

export function ContentArea({ content }: ContentAreaProps) {
  return (
    <Box flexGrow={1}>
      <Text color="primary" weight="bold">
        {content.group}
      </Text>
      <Heading size="8" as="h1">
        {content?.meta?.title}
      </Heading>
      <Text color="muted">{content?.meta?.description}</Text>
      <Box className={styles.content}>
        <Markdown content={content} />
      </Box>
    </Box>
  );
}