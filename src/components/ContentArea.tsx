import { Heading, Box, Text } from '@umami/react-zen';
import Markdown from './Markdown';
import styles from './ContentArea.module.css';

export interface ContentAreaProps {
  content: { [key: string]: any };
  components?: { [key: string]: any };
}

export function ContentArea({ content, components }: ContentAreaProps) {
  console.log({ content, components });

  if (!content.code) {
    return <h1>boooo</h1>;
  }

  return (
    <Box flexGrow={1}>
      <Text color="primary" weight="bold">
        {content.group}
      </Text>
      <Heading size="8" as="h1">
        {content.meta.title}
      </Heading>
      <Text type="muted">{content.meta.description}</Text>
      <Box className={styles.content}>
        <Markdown content={content} components={components} />
      </Box>
    </Box>
  );
}
