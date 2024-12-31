'use client';
import { Column } from '@umami/react-zen';
import styles from './Blog.module.css';
import { Markdown } from './Markdown';
import { Blogs } from './Blogs';

export interface BlogProps {
  content: any;
  config: any;
}

export function Blog({ content }: BlogProps) {
  if (!content) {
    return <Blogs />;
  }

  return (
    <Column className={styles.blog} flexGrow={1}>
      <div className={styles.main}>
        <div className={styles.content}>
          <h1>{content?.meta?.title}</h1>
          <p className={styles.description}>{content?.meta?.description}</p>
          <Markdown code={content?.code} />
        </div>
      </div>
    </Column>
  );
}
