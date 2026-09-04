import type { ReactNode } from 'react';
import { Badge } from './Badge';
import { styles } from './styles';
import { slugify } from './utils';

export interface UpdateRss {
  title?: string;
  description?: string;
}

export interface UpdateProps {
  /** Left-hand label. Also creates the anchor id (slugified, like headings). */
  label: string;
  description?: ReactNode;
  tags?: string[];
  /**
   * Mintlify compatibility: custom RSS title/description for this entry.
   * Shiso does not generate an RSS feed yet; the prop is accepted and ignored.
   */
  rss?: UpdateRss;
  children?: ReactNode;
}

function normalizeTags(tags: UpdateProps['tags']): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  const seen = new Set<string>();
  for (const tag of tags) {
    if (typeof tag !== 'string') {
      continue;
    }
    const trimmed = tag.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
    }
  }

  return [...seen];
}

export function Update({ label, description, tags, rss: _rss, children }: UpdateProps) {
  const id = slugify(label, 'update');
  const normalizedTags = normalizeTags(tags);

  return (
    <section
      id={id}
      aria-label={label}
      className={styles.update}
      data-tags={normalizedTags.join(',')}
    >
      <div className={styles.updateMeta}>
        <a href={`#${id}`} className={styles.updateLabel}>
          {label}
        </a>
        {description ? <div className={styles.updateDescription}>{description}</div> : null}
        {normalizedTags.length > 0 ? (
          <div className={styles.updateTags}>
            {normalizedTags.map(tag => (
              <Badge key={tag} size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
      <div className={styles.updateBody}>{children}</div>
    </section>
  );
}
