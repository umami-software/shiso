'use client';
import { Grid } from '@umami/react-zen';
import { Blog } from './Blog';
import { Card } from './Card';

export function Blogs({ content, config, ...props }) {
  if (!Array.isArray(content)) {
    const { meta, code, anchors, slug } = content;
    return <Blog {...props} {...meta} slug={slug} code={code} anchors={anchors} backUrl="/blog" />;
  }

  const items = content.sort(
    (a, b) => new Date(b?.meta?.date).getTime() - new Date(a?.meta?.date).getTime(),
  );

  return (
    <Grid gap="5" columns="repeat(auto-fit, minmax(400px, 1fr)">
      {items?.map(({ meta, slug }) => <Card key={slug} url={`/blog/${slug}`} {...meta} />)}
    </Grid>
  );
}
