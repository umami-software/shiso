import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search as SearchIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  const records = useRef<SearchRecord[] | null>(null);

  const runQuery = useCallback((value: string) => {
    setQuery(value);
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

  const select = (result: SearchResult) => {
    closeDialog();
    navigate(result.url);
  };

  return (
    <Dialog open={open} onOpenChange={nextOpen => (nextOpen ? openDialog() : closeDialog())}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="h-auto gap-2 rounded-md bg-card px-2.5 py-1.5 text-muted-foreground hover:border-input hover:bg-card hover:text-foreground"
          />
        }
      >
        <SearchIcon className="size-3.5" />
        <span className="min-w-24 text-left">{prompt}</span>
        <kbd className="rounded-sm border border-border bg-muted px-[0.3rem] py-[0.05rem] text-[0.7rem] font-sans">
          ⌘K
        </kbd>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/40 supports-backdrop-filter:backdrop-blur-none"
        className="top-[10vh] max-w-[calc(100%-2rem)] -translate-y-0 gap-0 overflow-hidden rounded-lg border border-border bg-background p-0 ring-0 shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:max-w-[34rem]"
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <Command shouldFilter={false} className="rounded-none bg-background p-0">
          <CommandInput
            autoFocus
            className="text-base md:text-base"
            placeholder={prompt}
            value={query}
            onValueChange={runQuery}
            onKeyDownCapture={event => {
              if (event.key === 'Home' || event.key === 'End') {
                event.stopPropagation();
              }
            }}
          />
          <CommandList className="max-h-[50vh] border-border border-t">
            {query ? <CommandEmpty>No results</CommandEmpty> : null}
            {query && results.length ? (
              <CommandGroup className="p-2">
                {results.map(result => (
                  <CommandItem
                    key={result.url}
                    value={result.url}
                    className="block whitespace-normal rounded-md px-3 py-2 text-left [&>svg:last-child]:hidden"
                    onSelect={() => select(result)}
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
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
