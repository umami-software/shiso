'use client';
import { Heading, Box, Text, Row, Column, Image, Icon, Icons, Button } from '@umami/react-zen';
import { format } from 'date-fns';
import { PageLinks } from '@/components/PageLinks';
import { useShiso } from '@/components/hooks/useShiso';
import { Markdown } from './Markdown';
import Link from 'next/link';

export interface BlogProps {
  title: string;
  description?: string;
  code: string;
  author?: string;
  date?: string;
  image?: string;
  anchors?: any[];
  backUrl?: string;
}

export function Blog({ title, code, author, date, image, anchors, backUrl }: BlogProps) {
  const { config } = useShiso();

  const { top } = config?.blog || {};

  const linksDisplay = {
    xs: 'none',
    lg: 'block',
  };

  return (
    <Column gap="8" maxWidth="960px" style={{ margin: '0 auto' }}>
      <Box flexGrow="1" paddingY="6">
        {title && (
          <Heading size="6" as="h1" align="center">
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
      {backUrl && (
        <Row justifyContent="flex-start">
          <Button style={{ width: 'auto' }} asChild>
            <Link href={backUrl}>
              <Icon rotate={180}>
                <Icons.Arrow />
              </Icon>
              <Text>Back</Text>
            </Link>
          </Button>
        </Row>
      )}
    </Column>
  );
}
