'use client';
import { Row, Text, ThemeButton, Button, Icon } from '@umami/react-zen';
import Link from 'next/link';
import { Github } from '@/components/svg';

export function Header() {
  return (
    <Row justifyContent="space-between" alignItems="center">
      <Row paddingY="5" gap="5" alignItems="center">
        <Text
          size="xl"
          weight="bold"
          spacing="tighter"
          render={(props) => (
            <Link href="/" {...props}>
              shiso
            </Link>
          )}
        />
        <Link href="/docs">docs</Link>
      </Row>
      <Row gap="2" alignItems="center">
        <ThemeButton />
        <Button
          variant="quiet"
          render={(props) => <Link href="https://github.com/umami-software/react-zen" target="_blank" {...props} />}
        >
          <Icon fillColor="strong">
            <Github />
          </Icon>
        </Button>
      </Row>
    </Row>
  );
}
