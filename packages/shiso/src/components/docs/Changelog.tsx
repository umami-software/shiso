import { Children, Fragment, isValidElement, type ReactElement, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { Badge } from './Badge';
import { styles } from './styles';
import { Update } from './Update';

export interface ChangelogProps {
  children?: React.ReactNode;
}

interface UpdateChildInfo {
  key: string;
  tags: string[];
}

/** Flattens fragments so <Update> entries are found however MDX nests them. */
function flatElements(children: React.ReactNode): ReactElement<{ tags?: unknown }>[] {
  const flat: ReactElement<{ tags?: unknown }>[] = [];

  Children.forEach(children, child => {
    if (!isValidElement<{ tags?: unknown }>(child)) {
      return;
    }
    if (child.type === Fragment) {
      flat.push(...flatElements(child.props.children));
    } else {
      flat.push(child);
    }
  });

  return flat;
}

/** Reads `tags` off <Update> children without rendering them. */
function updateInfo(children: React.ReactNode): Map<string, UpdateChildInfo> {
  const info = new Map<string, UpdateChildInfo>();

  flatElements(children).forEach((child, index) => {
    if (child.type !== Update) {
      return;
    }

    const key = String(child.key ?? `update-${index}`);
    const raw = child.props.tags;
    const tags = Array.isArray(raw)
      ? [...new Set(raw.filter((tag): tag is string => typeof tag === 'string' && tag.trim()))].map(
          tag => tag.trim(),
        )
      : [];
    info.set(key, { key, tags });
  });

  return info;
}

/**
 * Groups <Update> entries with Mintlify-style tag filtering.
 * Selected tags sync to `?tags=a,b` so filtered views are shareable.
 * Pages without any tagged updates render as a plain list.
 */
export function Changelog({ children }: ChangelogProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const allTags = useMemo(() => {
    const seen = new Map<string, string>();
    for (const { tags } of updateInfo(children).values()) {
      for (const tag of tags) {
        const key = tag.toLowerCase();
        if (!seen.has(key)) {
          seen.set(key, tag);
        }
      }
    }
    return [...seen.values()];
  }, [children]);

  const selected = useMemo(() => {
    const param = searchParams.get('tags');
    if (!param) {
      return [];
    }
    const wanted = new Set(
      param
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(Boolean),
    );
    return allTags.filter(tag => wanted.has(tag.toLowerCase()));
  }, [searchParams, allTags]);

  const infoByKey = useMemo(() => updateInfo(children), [children]);

  if (allTags.length === 0) {
    return <div className={styles.changelog}>{children}</div>;
  }

  const toggle = (tag: string) => {
    const lower = tag.toLowerCase();
    const next = selected.some(item => item.toLowerCase() === lower)
      ? selected.filter(item => item.toLowerCase() !== lower)
      : [...selected, tag];

    setSearchParams(next.length ? { tags: next.join(',') } : {}, { preventScrollReset: true });
  };

  const clear = () => {
    setSearchParams({}, { preventScrollReset: true });
  };

  const selectedSet = new Set(selected.map(tag => tag.toLowerCase()));

  const filtered = flatElements(children).map((child, index) => {
    if (child.type !== Update) {
      return child;
    }
    const key = String(child.key ?? `update-${index}`);
    const tags = infoByKey.get(key)?.tags ?? [];
    if (selectedSet.size === 0) {
      return child;
    }
    const lower = tags.map(tag => tag.toLowerCase());
    const matches = [...selectedSet].every(tag => lower.includes(tag));
    return matches ? child : null;
  });

  const visibleUpdates = filtered.filter(
    child => child && (child as React.ReactElement).type === Update,
  ).length;

  return (
    <div className={styles.changelog}>
      {/* biome-ignore lint/a11y/useSemanticElements: toggle-button group labelled for the filter */}
      <div className={styles.changelogFilters} role="group" aria-label="Filter updates by tag">
        {allTags.map(tag => {
          const active = selectedSet.has(tag.toLowerCase());
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              aria-pressed={active}
              className={styles.changelogFilterButton}
              data-active={active ? '' : undefined}
            >
              <Badge size="sm" color={active ? 'primary' : undefined}>
                {tag}
              </Badge>
            </button>
          );
        })}
        {selected.length > 0 ? (
          <button type="button" onClick={clear} className={styles.changelogClear}>
            Clear
          </button>
        ) : null}
      </div>
      {visibleUpdates === 0 ? (
        <p className={styles.changelogEmpty}>No updates match the selected tags.</p>
      ) : null}
      {filtered}
    </div>
  );
}
