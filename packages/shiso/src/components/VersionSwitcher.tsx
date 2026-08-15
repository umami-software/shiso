import { useLocation, useNavigate } from 'react-router';
import { Check, ChevronRight } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { docsSite, getScopeByPathname } from '@/lib/site-config';

/**
 * Version selector for multi-version sites. Options come from the visible
 * version scopes of the active language; selecting one navigates to that
 * scope's first visible page. Hidden versions never appear as options, but a
 * hidden version still shows as the current value while it is being viewed.
 */
export function VersionSwitcher() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = getScopeByPathname(pathname);
  const options = docsSite.scopes.filter(
    scope => scope.version && !scope.hidden && scope.language === current.language,
  );

  if (!current.version || (options.length < 2 && !current.hidden)) {
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
        {current.version}
        <ChevronRight className="size-3.5 rotate-90 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-32">
        {options.map(scope => (
          <DropdownMenuItem
            key={scope.id}
            onClick={() => {
              if (scope.id !== current.id) {
                navigate(scope.firstPageUrl);
              }
            }}
          >
            <span className="grow">{scope.version}</span>
            {scope.id === current.id ? <Check className="size-3.5" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
