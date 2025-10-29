import Link from 'next/link';
import { SearchField, Row, Grid, Column, Text, RowProps } from '@umami/react-zen';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { formatBookmark } from '@/lib/utils';

export function SearchDialog() {
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useQuery({
    queryKey: ['search', { query }],
    queryFn: async () => {
      const res = await fetch(`/api/search/docs?q=${encodeURIComponent(query)}`);

      return res.json();
    },
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

  const handleSearch = async (value: string) => {
    setQuery(value);
  };

  return (
    <Grid
      columns={{ xs: '1fr', md: 'minmax(600px, 1fr)' }}
      rows="auto 1fr"
      maxHeight="calc(90vh - 60px)"
      overflow="hidden"
      gap
    >
      <SearchField placeholder="Search..." onSearch={handleSearch} delay={500} autoFocus />
      <Column overflow="auto">
        {results?.map((result: any, index: number) => (
          <Column key={result.document.slug}>
            <SearchResult href={result.document.slug}>
              <Text weight="bold">{result.document.title}</Text>
            </SearchResult>
            <SearchContent
              content={result.document.content}
              slug={result.document.slug}
              query={query}
            />
          </Column>
        ))}
      </Column>
      {!isLoading && results?.length === 0 && (
        <Row justifyContent="center" alignItems="center" padding="6">
          <Text>No results.</Text>
        </Row>
      )}
    </Grid>
  );
}

function SearchResult({ href, children, ...props }: { href: string } & RowProps) {
  return (
    <Link href={`/${href}`}>
      <Row hoverBackgroundColor="2" padding="3" borderRadius {...props}>
        {children}
      </Row>
    </Link>
  );
}

function SearchContent({ content, slug, query }: { content: string; slug: string; query: string }) {
  let bookmark = '';
  return content
    ?.split('\n')
    .map((line: string, index: number) => {
      const match = line.match(/#+\s+(\w+)/);

      if (match) {
        bookmark = formatBookmark(match[1]);
      }

      if (!line.includes(query)) {
        return null;
      }

      const href = slug + (bookmark ? `#${bookmark}` : '');

      return (
        <SearchResult key={index} href={href} border="left" marginLeft="3">
          {line.slice(0, 120)}
        </SearchResult>
      );
    })
    .filter(n => n);
}
