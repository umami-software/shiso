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
import { docsSite, getScopeByPathname } from '@/lib/site-config';

/**
 * Language selector for multi-language sites. Each option is a language's
 * landing scope — its default version — so switching languages always lands
 * on that language's default-version first page. Hidden languages never
 * appear as options.
 */
export function LanguageSwitcher() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = getScopeByPathname(pathname);
  const options = getLanguageScopes(docsSite);

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
        {current.language}
        <ChevronRight className="size-3.5 rotate-90 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-32">
        {options.map(scope => (
          <DropdownMenuItem
            key={scope.id}
            onClick={() => {
              if (scope.language !== current.language) {
                navigate(scope.firstPageUrl);
              }
            }}
          >
            <span className="grow">{scope.language}</span>
            {scope.language === current.language ? <Check className="size-3.5" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
