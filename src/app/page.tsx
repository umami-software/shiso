import { Heading, Text, Row, Column, Icon, Button } from '@umami/react-zen';
import Link from 'next/link';
import { Leaf } from '@/components/icons';

export default function Home() {
  return (
    <Column gap="3" style={{ margin: '0 auto' }} flexGrow={1}>
      <Heading size="5">shiso</Heading>
      <Icon size="lg">
        <Leaf />
      </Icon>
      <Text as="p" color="muted">
        Publish content using MDX.
      </Text>
      <Row gap="3">
        <Button variant="primary" asChild>
          <Link href="/docs">Get started</Link>
        </Button>
        <Button asChild>
          <Link href="https://github.com/umami-software/shiso">View code</Link>
        </Button>
      </Row>
    </Column>
  );
}
