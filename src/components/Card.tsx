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
      <Column padding="6" gap="4">
        <Heading size="4" as="header">
          <Link href={url}>{title}</Link>
        </Heading>
        <Text as="p">{description}</Text>
        <Row justifyContent="space-between" marginTop="5">
          <Text color="muted">{date && format(new Date(date), 'PP')}</Text>
          <Text color="muted">{author}</Text>
        </Row>
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
