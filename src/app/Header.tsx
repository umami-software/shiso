import { Row, Text, ThemeButton, Button, Icon } from '@umami/react-zen';
import Link from 'next/link';
import { Github } from '@/components/svg';

export function Header() {
  return (
    <Row justifyContent="space-between" alignItems="center">
      <Row paddingY="5" gap="5" alignItems="center">
        <Text size="5" weight="bold" spacing="1" asChild>
          <Link href="/">shiso</Link>
        </Text>
        <Link href="/docs">docs</Link>
        <Link href="/blog">blog</Link>
      </Row>
      <Row gap="2" alignItems="center">
        <ThemeButton />
        <Button variant="quiet" asChild>
          <Link href="https://github.com/umami-software/react-zen" target="_blank">
            <Icon fillColor="currentColor">
              <Github />
            </Icon>
          </Link>
        </Button>
      </Row>
    </Row>
  );
}
