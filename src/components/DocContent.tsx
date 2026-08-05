import { Link } from 'react-router';
import { ChevronRight } from '@/components/icons';
import { getPrevNext } from '@/lib/site-config';
import type { DocModule, NormalizedDocsPage } from '@/lib/types';
import styles from './DocContent.module.css';

export interface DocContentProps {
  page: NormalizedDocsPage;
  doc: DocModule;
}

export function DocContent({ page, doc }: DocContentProps) {
  const { prev, next } = getPrevNext(page.slug);
  const title = doc.frontmatter?.title || page.label;
  const description = doc.frontmatter?.description;
  const Content = doc.default;

  return (
    <article className={styles.content}>
      {page.section && <div className={styles.section}>{page.section}</div>}
      {title && <h1 className={styles.title}>{title}</h1>}
      {description && <p className={styles.description}>{description}</p>}
      <div className="docs-markdown">
        <Content />
      </div>
      <div className={styles.pager}>
        <NavigationButton {...prev} isPrev />
        <NavigationButton {...next} />
      </div>
    </article>
  );
}

const NavigationButton = ({
  label,
  url,
  isPrev,
}: {
  label?: string;
  url?: string;
  isPrev?: boolean;
}) => {
  if (!url || !label) {
    return <div />;
  }

  return (
    <Link to={url} className={styles.pagerLink}>
      {isPrev && <ChevronRight size={14} className={styles.prevIcon} />}
      {label}
      {!isPrev && <ChevronRight size={14} />}
    </Link>
  );
};
