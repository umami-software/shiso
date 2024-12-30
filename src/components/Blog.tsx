'use client';
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
    <div className={styles.blog}>
      <div className={styles.main}>
        <div className={styles.content}>
          <h1>{content?.meta?.title}</h1>
          <p className={styles.description}>{content?.meta?.description}</p>
          <Markdown content={content} />
        </div>
      </div>
    </div>
  );
}
