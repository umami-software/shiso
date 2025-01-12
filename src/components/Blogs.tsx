import { Box, Column, Grid, Heading, Row } from '@umami/react-zen';
import { Blog } from './Blog';
import { Card } from './Card';

export function Blogs({ content, config }) {
  if (!Array.isArray(content)) {
    const { meta, code, anchors, slug } = content;
    return <Blog {...meta} code={code} anchors={anchors} />;
  }

  console.log({ content });

  return (
    <Grid gap="5" columns="repeat(auto-fit, minmax(400px, 1fr)">
      {content
        ?.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
        .map(({ meta, slug }) => <Card key={slug} url={`/blog/${slug}`} {...meta} />)}
    </Grid>
  );
}
