import { useLocation, useNavigate } from 'react-router';
import { Check, ChevronRight } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getLanguageScopes } from '@/lib/docs-config';
import { getLanguageName, isValidLocale } from '@/lib/locale';
import {
  docsSite,
  getScopeByPathname,
  getStandaloneCounterpart,
  getStandalonePage,
} from '@/lib/site-config';

/**
 * Language selector for multi-language sites. Each option is a language's
 * landing scope — its default version — so switching languages lands on that
 * language's default-version first page. On a standalone page (e.g. a home
 * page) it lands on the same page in the chosen language when one exists.
 * Hidden languages never
 * appear as options. Each language is shown by its native name, e.g. "ja"
 * as "日本語".
 */
export function LanguageSwitcher() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = getScopeByPathname(pathname);
  const options = getLanguageScopes(docsSite);
  const standalone = getStandalonePage(pathname);

  if (!current.language || (options.length < 2 && !current.hidden)) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="h-auto gap-1.5 rounded-md bg-card px-2.5 py-1.5 text-sm font-medium text-foreground"
          />
        }
      >
        {getLanguageName(current.language)}
        <ChevronRight className="size-3.5 rotate-90 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-32">
        {options.map(scope => (
          <DropdownMenuItem
            key={scope.id}
            onClick={() => {
              if (scope.language !== current.language) {
                const counterpart =
                  standalone && scope.language
                    ? getStandaloneCounterpart(standalone, scope.language)
                    : null;

                navigate(counterpart?.path || scope.firstPageUrl);
              }
            }}
          >
            <span
              className="grow"
              lang={isValidLocale(scope.language) ? scope.language : undefined}
            >
              {scope.language ? getLanguageName(scope.language) : null}
            </span>
            {scope.language === current.language ? <Check className="size-3.5" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
