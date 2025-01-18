import { Heading, Box, Text, Row, Column, Image } from '@umami/react-zen';
import { format } from 'date-fns';
import { PageLinks } from '@/components/PageLinks';
import { useShiso } from '@/components/hooks/useShiso';
import { Markdown } from './Markdown';

export interface BlogProps {
  title: string;
  description?: string;
  code: string;
  author?: string;
  date?: string;
  image?: string;
  anchors?: any[];
}

export function Blog({ title, code, author, date, image, anchors }: BlogProps) {
  const { config } = useShiso();

  const { top } = config?.blog || {};

  const linksDisplay = {
    default: 'none',
    xs: 'none',
    sm: 'none',
    md: 'none',
    lg: 'block',
    xl: 'block',
  };

  return (
    <Column gap="8" maxWidth="960px" style={{ margin: '0 auto' }}>
      <Box flexGrow="1" paddingY="6">
        {title && (
          <Heading size="1" as="h1" align="center">
            {title}
          </Heading>
        )}
      </Box>
      <Row justifyContent="space-between">
        <Text color="muted">{date && format(new Date(date), 'PPP')}</Text>
        <Text color="muted">Posted by {author}</Text>
      </Row>
      {image && (
        <Box height="480px">
          <Image src={image} alt={title} objectFit="cover" borderRadius="3" />
        </Box>
      )}
      <Row gap="6">
        <Markdown code={code} />
        <PageLinks display={linksDisplay} items={anchors} style={{ top }} />
      </Row>
    </Column>
  );
}
