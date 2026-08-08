import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { Search as SearchIcon } from '@/components/icons';
import { type SearchRecord, type SearchResult, searchIndex } from '@/lib/search';
import { getSearchPrompt } from '@/lib/site-config';

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
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-muted-foreground hover:border-input hover:text-foreground"
        onClick={openDialog}
      >
        <SearchIcon size={14} />
        <span className="min-w-24 text-left">{prompt}</span>
        <kbd className="rounded-sm border border-border bg-muted px-[0.3rem] py-[0.05rem] text-[0.7rem] font-sans">
          ⌘K
        </kbd>
      </button>
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] pb-4">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              onClick={closeDialog}
              aria-label="Close search"
            />
            <div
              className="relative w-full max-w-[34rem] overflow-hidden rounded-lg border border-border bg-background shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
              role="dialog"
              aria-label="Search"
            >
              <div className="flex items-center gap-2 px-4 py-3">
                <SearchIcon size={16} className="shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full border-none bg-transparent text-base text-foreground outline-none [font:inherit]"
                  placeholder={prompt}
                  value={query}
                  onChange={event => runQuery(event.target.value)}
                  onKeyDown={onInputKeyDown}
                />
              </div>
              {query && (
                <div className="max-h-[50vh] overflow-y-auto border-border border-t p-2">
                  {results.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">No results</div>
                  )}
                  {results.map((result, index) => (
                    <button
                      type="button"
                      key={result.url}
                      className={classNames('block w-full rounded-md px-3 py-2 text-left', {
                        'bg-muted': index === active,
                      })}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => select(result)}
                    >
                      <div className="text-[0.9rem] font-semibold text-foreground">
                        {result.record.page}
                        {result.record.heading ? ` › ${result.record.heading}` : ''}
                      </div>
                      {result.snippet && (
                        <div className="mt-[0.15rem] line-clamp-2 text-[0.8rem] text-muted-foreground">
                          {result.snippet}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
