import { Heading, Box, Text, Row, Icon } from '@umami/react-zen';
import Link from 'next/link';
import { Markdown } from '@/components/common/Markdown';
import { ChevronRight } from '@/components/icons';
import { useShiso } from '@/components';

export interface DocsContentProps {
  section?: string;
  title?: string;
  description?: string;
  code: string;
  nextPage?: any;
  prevPage?: any;
}

export function DocContent({
  section,
  title,
  description,
  code,
  nextPage,
  prevPage,
}: DocsContentProps) {
  const { mdxFiles } = useShiso();
  const next = mdxFiles.find(page => page.slug === nextPage);
  const prev = mdxFiles.find(page => page.slug === prevPage);

  return (
    <Box flexGrow="1">
      {section && (
        <Text color="primary" weight="bold">
          {section}
        </Text>
      )}
      {title && (
        <Heading size="5" as="h1" marginY="3">
          {title}
        </Heading>
      )}
      {description && (
        <Text color="muted" size="3">
          {description}
        </Text>
      )}
      <Markdown code={code} />
      <Row justifyContent="space-between">
        <NavigationButton label={prev?.meta?.title} url={`/${prev?.slug}`} isPrev />
        <NavigationButton label={next?.meta?.title} url={`/${next?.slug}`} />
      </Row>
    </Box>
  );
}

const NavigationButton = ({
  label,
  url,
  isPrev,
}: {
  label: string;
  url: string;
  isPrev?: boolean;
}) => {
  if (!url || !label) {
    return <Box />;
  }

  return (
    <Link href={url}>
      <Row alignItems="center" gap="3" marginY="3">
        {isPrev && (
          <Icon size="sm" rotate={180}>
            <ChevronRight />
          </Icon>
        )}
        <Text size="3" weight="bold">
          {label}
        </Text>
        {!isPrev && (
          <Icon size="sm">
            <ChevronRight />
          </Icon>
        )}
      </Row>
    </Link>
  );
};
