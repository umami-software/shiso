import styles from './Blog.module.css';
import Markdown from '../Markdown';

export interface BlogProps {
  content: any;
  config: any;
}

export function Blog({ content }: BlogProps) {
  return (
    <div className={styles.blog}>
      <div className={styles.main}>
        <div className={styles.content}>
          <h1>{content?.meta?.title}</h1>
          <p className={styles.description}>{content?.meta?.description}</p>
          <Markdown>{content?.body}</Markdown>
        </div>
      </div>
    </div>
  );
}
