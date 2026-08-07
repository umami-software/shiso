import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search as SearchIcon } from '@/components/icons';
import { type SearchRecord, type SearchResult, searchIndex } from '@/lib/search';
import { getSearchPrompt } from '@/lib/site-config';
import styles from './Search.module.css';

/**
 * Search dialog over the build-time index. The index module is dynamically
 * imported on first open, so Vite splits page text out of the initial bundle.
 */
export function Search() {
  const navigate = useNavigate();
  const prompt = getSearchPrompt();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [active, setActive] = useState(0);
  const records = useRef<SearchRecord[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runQuery = useCallback((value: string) => {
    setQuery(value);
    setActive(0);
    setResults(records.current ? searchIndex(records.current, value) : []);
  }, []);

  const openDialog = useCallback(() => {
    setOpen(true);

    if (!records.current) {
      import('@/lib/search-index.generated').then(module => {
        records.current = module.SEARCH_INDEX;
      });
    }
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setActive(0);
  }, []);

  // Global shortcut: Cmd/Ctrl+K.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        openDialog();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openDialog]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const select = (result: SearchResult) => {
    closeDialog();
    navigate(result.url);
  };

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeDialog();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(current => Math.min(current + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(current => Math.max(current - 1, 0));
    } else if (event.key === 'Enter' && results[active]) {
      select(results[active]);
    }
  };

  return (
    <>
      <button type="button" className={styles.trigger} onClick={openDialog}>
        <SearchIcon size={14} />
        <span className={styles.prompt}>{prompt}</span>
        <kbd className={styles.kbd}>⌘K</kbd>
      </button>
      {open && (
        <div className={styles.overlay}>
          <button
            type="button"
            className={styles.backdrop}
            onClick={closeDialog}
            aria-label="Close search"
          />
          <div className={styles.dialog} role="dialog" aria-label="Search">
            <div className={styles.inputRow}>
              <SearchIcon size={16} className={styles.inputIcon} />
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder={prompt}
                value={query}
                onChange={event => runQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
              />
            </div>
            {query && (
              <div className={styles.results}>
                {results.length === 0 && <div className={styles.empty}>No results</div>}
                {results.map((result, index) => (
                  <button
                    type="button"
                    key={result.url}
                    className={index === active ? styles.resultActive : styles.result}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => select(result)}
                  >
                    <div className={styles.resultTitle}>
                      {result.record.page}
                      {result.record.heading ? ` › ${result.record.heading}` : ''}
                    </div>
                    {result.snippet && <div className={styles.resultSnippet}>{result.snippet}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
