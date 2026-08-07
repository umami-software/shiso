import { Link } from 'react-router';
import { ChevronRight } from '@/components/icons';
import { getLastModified } from '@/lib/content';
import { getPrevNext, getStyling, showTimestamp } from '@/lib/site-config';
import type { DocModule, NormalizedDocsPage } from '@/lib/types';
import styles from './DocContent.module.css';

export interface DocContentProps {
  page: NormalizedDocsPage;
  doc: DocModule;
}

/** Fixed locale and UTC keep the prerendered markup identical to hydration. */
const DATE_FORMAT = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });

export function DocContent({ page, doc }: DocContentProps) {
  const { prev, next } = getPrevNext(page.slug);
  const title = doc.frontmatter?.title || page.label;
  const description = doc.frontmatter?.description;
  const Content = doc.default;
  const lastModified = showTimestamp(doc.frontmatter?.timestamp)
    ? getLastModified(page.filePath)
    : undefined;
  // `styling.eyebrows`: the section name alone, or the full navigation path.
  const eyebrow =
    getStyling().eyebrows === 'breadcrumbs'
      ? [...new Set([page.tabLabel, page.section])].filter(Boolean).join(' / ')
      : page.section;

  return (
    <article className={styles.content}>
      {eyebrow && <div className={styles.section}>{eyebrow}</div>}
      {title && <h1 className={styles.title}>{title}</h1>}
      {description && <p className={styles.description}>{description}</p>}
      <div className="docs-markdown">
        <Content />
      </div>
      {lastModified && (
        <div className={styles.timestamp}>
          Last updated on{' '}
          <time dateTime={lastModified}>{DATE_FORMAT.format(new Date(lastModified))}</time>
        </div>
      )}
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
