'use client';
import { Heading, Box, Text, Row, Column, Image, Icon, Button } from '@umami/react-zen';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageLinks } from '@/components/common/PageLinks';
import { Markdown } from '@/components/common/Markdown';
import { BlogConfig, ComponentProps, Content } from '@/lib/types';

export function BlogPost({ content, config }: ComponentProps<BlogConfig>) {
  const {
    meta: { title, description, author, date, image, anchors },
    code,
  } = content as Content;

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
        <PageLinks
          display={{
            xs: 'none',
            lg: 'flex',
          }}
          items={anchors}
        />
      </Row>
      <Row justifyContent="flex-start">
        <Button style={{ width: 'auto' }} asChild>
          <Link href={'/blog'}>
            <Icon rotate={180}>
              <ArrowRight />
            </Icon>
            <Text>Back</Text>
          </Link>
        </Button>
      </Row>
    </Column>
  );
}
