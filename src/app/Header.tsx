import { Row, Text } from '@umami/react-zen';
import Link from 'next/link';

export function Header() {
  return (
    <Row paddingY="5" gap="5" alignItems="center">
      <Text size="5" weight="bold" spacing="1" asChild>
        <Link href="/">shiso</Link>
      </Text>
      <Link href="/docs">docs</Link>
      <Link href="/blog">blog</Link>
    </Row>
  );
}
