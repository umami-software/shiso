'use client';
import { Heading, Text, Row, Column, Icon, Button } from '@umami/react-zen';
import Link from 'next/link';
import { Leaf } from '@/components/svg';

export default function Home() {
  return (
    <Column gap="3" style={{ margin: '0 auto' }} flexGrow="1">
      <Heading size="2xl" as="h1">
        shiso
      </Heading>
      <Icon size="lg">
        <Leaf />
      </Icon>
      <Text as="p" color="muted">
        Publish content using MDX.
      </Text>
      <Row gap="3">
        <Button variant="primary" render={(props) => <Link href="/docs" {...props} />}>
          Get started
        </Button>
        <Button render={(props) => <Link href="https://github.com/umami-software/shiso" {...props} />}>
          View code
        </Button>
      </Row>
    </Column>
  );
}
