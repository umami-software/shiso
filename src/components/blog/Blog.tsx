'use client';
import { Grid } from '@umami/react-zen';
import { Card } from './Card';
import { BlogConfig, BlogMetadata, ComponentProps } from '@/lib/types';

export function Blog({ collection }: ComponentProps<BlogConfig>) {
  const items = collection?.sort(
    (a, b) => new Date(b?.meta?.date).getTime() - new Date(a?.meta?.date).getTime(),
  );

  return (
    <Grid gap="5" columns={{ xs: '1fr', lg: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
      {items?.map(({ meta, slug }) => (
        <Card key={slug} url={`/blog/${slug}`} {...(meta as BlogMetadata)} />
      ))}
    </Grid>
  );
}
