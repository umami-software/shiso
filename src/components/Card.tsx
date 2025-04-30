import { Box, Image, Column, Row, Heading, Text, Button, Icon, Icons } from '@umami/react-zen';
import Link from 'next/link';
import { format } from 'date-fns';

export interface CardProps {
  title: string;
  description: string;
  date: string;
  author: string;
  url: string;
  image?: string;
}

export function Card({ title, description, date, author, url, image }: CardProps) {
  return (
    <Column borderSize="1" borderRadius="3" overflow="hidden">
      {image && (
        <Box height="240px">
          <Image src={image} alt={title} objectFit="cover" />
        </Box>
      )}
      <Column padding="6" gap="4" flexGrow="1">
        <Row justifyContent="space-between">
          <Text color="muted">{date && format(new Date(date), 'PP')}</Text>
          <Text color="muted">Posted by {author}</Text>
        </Row>
        <Column gap="4" flexGrow="1">
          <Heading size="3" as="header">
            <Link href={url}>{title}</Link>
          </Heading>
          <Box marginY="5" as="p">
            <Text color="muted" size="3">
              {description}
            </Text>
          </Box>
        </Column>
        <Button asChild>
          <Link href={url}>
            <Text>Read more</Text>
            <Icon>
              <Icons.Arrow />
            </Icon>
          </Link>
        </Button>
      </Column>
    </Column>
  );
}
