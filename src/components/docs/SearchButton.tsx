import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Link from 'next/link';
import {
  DialogTrigger,
  Dialog,
  Modal,
  SearchField,
  Row,
  Button,
  Grid,
  Column,
  Icon,
  Pressable,
  Loading,
  Text,
} from '@umami/react-zen';
import { Search } from '@/components/icons';

export function SearchButton() {
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

  console.log({ results, isLoading });

  const handleSearch = async (value: string) => {
    setQuery(value);
  };

  return (
    <DialogTrigger>
      <Pressable>
        <Row
          alignItems="center"
          justifyContent="flex-start"
          width="100%"
          gap
          padding
          border
          borderRadius
          backgroundColor="2"
          style={{ cursor: 'pointer' }}
        >
          <Icon color="muted">
            <Search />
          </Icon>
          <Text color="muted">Search</Text>
        </Row>
      </Pressable>
      <Modal>
        <Dialog>
          <Grid columns={{ xs: '1fr', md: 'minmax(600px, 1fr)' }} gap>
            <SearchField placeholder="Search..." onSearch={handleSearch} delay={500} autoFocus />
            {results?.map((result: any) => (
              <Column key={result.score}>
                <Link href={result.document.slug}>
                  <Text weight="bold">{result.document.title}</Text>
                </Link>
                <p>{result.document.content.slice(0, 120)}...</p>
              </Column>
            ))}
            {!isLoading && results?.length === 0 && (
              <Row justifyContent="center" alignItems="center" padding="6">
                <Text>No results.</Text>
              </Row>
            )}
          </Grid>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
