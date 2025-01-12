import { Heading, Box, Text, Row, Column, Grid, Image, Icon, Icons } from '@umami/react-zen';
import { format } from 'date-fns';
import { PageLinks } from '@/components/PageLinks';
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

export function Blog({ title, description, code, author, date, image, anchors }: BlogProps) {
  return (
    <Column gap="8" maxWidth="900px" style={{ margin: '0 auto' }}>
      <Box flexGrow={1}>
        {title && (
          <Heading size="1" as="h1" align="center">
            {title}
          </Heading>
        )}
      </Box>
      {image && (
        <Box height="480px">
          <Image src={image} alt={title} objectFit="cover" borderRadius="3" />
        </Box>
      )}
      <Row justifyContent="space-between">
        <Text>{author}</Text>
        <Text>{date && format(new Date(date), 'PP')}</Text>
      </Row>
      <Grid columns="1fr 240px" gap="5">
        <Markdown code={code} />
        <PageLinks items={anchors} />
      </Grid>
    </Column>
  );
}
