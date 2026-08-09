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
import type { SearchResult } from '@/lib/search';
import { resolveSearchProvider, type SearchProvider } from '@/lib/search/provider';
import { getSearchConfig } from '@/lib/site-config';

/**
 * Provider-neutral search dialog. The selected provider and its index or
 * client are loaded on demand, so search stays out of the initial bundle.
 */
export function Search() {
  const navigate = useNavigate();
  const config = getSearchConfig();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const provider = useRef<Promise<SearchProvider> | null>(null);
  const requestId = useRef(0);

  const loadProvider = useCallback(() => {
    if (!provider.current) {
      provider.current = resolveSearchProvider(config.provider, config.options)
        .then(resolved => {
          if (resolved.fellBack) {
            console.warn(
              `[shiso] Unknown search provider "${config.provider}" — using the built-in local provider.`,
            );
          }

          return resolved.provider;
        })
        .catch(error => {
          provider.current = null;
          throw error;
        });
    }

    return provider.current;
  }, [config.options, config.provider]);

  const runQuery = useCallback(
    async (value: string) => {
      const currentRequest = ++requestId.current;
      setQuery(value);

      if (!value.trim()) {
        setResults([]);
        setStatus('idle');
        return;
      }

      setResults([]);
      setStatus('loading');

      try {
        const activeProvider = await loadProvider();
        const nextResults = await activeProvider.search(value);

        if (currentRequest === requestId.current) {
          setResults(nextResults);
          setStatus('ready');
        }
      } catch (error) {
        if (currentRequest === requestId.current) {
          console.error('[shiso] Search provider failed:', error);
          setResults([]);
          setStatus('error');
        }
      }
    },
    [loadProvider],
  );

  const openDialog = useCallback(() => {
    if (!config.enabled) {
      return;
    }

    setOpen(true);
    void loadProvider().catch(error => {
      console.error('[shiso] Search provider failed to load:', error);
    });
  }, [config.enabled, loadProvider]);

  const closeDialog = useCallback(() => {
    requestId.current += 1;
    setOpen(false);
    setQuery('');
    setResults([]);
    setStatus('idle');
  }, []);

  // Global shortcut: Cmd/Ctrl+K.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (config.enabled && (event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        openDialog();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [config.enabled, openDialog]);

  const select = (result: SearchResult) => {
    closeDialog();
    navigate(result.url);
  };

  if (!config.enabled) {
    return null;
  }

  const hasQuery = !!query.trim();

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
        <span className="min-w-24 text-left">{config.prompt}</span>
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
            placeholder={config.prompt}
            value={query}
            onValueChange={runQuery}
            onKeyDownCapture={event => {
              if (event.key === 'Home' || event.key === 'End') {
                event.stopPropagation();
              }
            }}
          />
          <CommandList className="max-h-[50vh] border-border border-t">
            {hasQuery ? (
              <CommandEmpty>
                {status === 'loading'
                  ? 'Searching...'
                  : status === 'error'
                    ? 'Search unavailable'
                    : 'No results'}
              </CommandEmpty>
            ) : null}
            {hasQuery && results.length ? (
              <CommandGroup className="p-2">
                {results.map(result => (
                  <CommandItem
                    key={result.url}
                    value={result.url}
                    className="block whitespace-normal rounded-md px-3 py-2 text-left [&>svg:last-child]:hidden"
                    onSelect={() => select(result)}
                  >
                    <div className="text-[0.9rem] font-semibold text-foreground">
                      {result.page}
                      {result.heading ? ` › ${result.heading}` : ''}
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
