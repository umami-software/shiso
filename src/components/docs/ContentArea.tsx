import { Heading, Box, Text } from '@umami/react-zen';
import Markdown from '@/components/Markdown';

export interface ContentAreaProps {
  title: string;
  body: string;
  description?: string;
  group?: string;
}

export function ContentArea({ title, description, group, body }: ContentAreaProps): JSX.Element {
  return (
    <Box flexGrow={1}>
      <Text color="primary">{group}</Text>
      <Heading size="8">{title}</Heading>
      <Text type="muted">{description}</Text>
      <Markdown>{body}</Markdown>
    </Box>
  );
}
