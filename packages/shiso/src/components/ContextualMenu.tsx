import { useState } from 'react';
import { ConfiguredIcon } from '@/components/ConfiguredIcon';
import { Check, ChevronRight } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ResolvedContextualOption, ThemeLabels } from '@/lib/types';

export function ContextualMenu({
  options,
  labels,
}: {
  options: ResolvedContextualOption[];
  labels: ThemeLabels;
}) {
  const [copied, setCopied] = useState(false);
  const primary = options[0];

  if (!primary) {
    return null;
  }

  const runOption = async (option: ResolvedContextualOption) => {
    if (option.action === 'copy') {
      try {
        const response = await fetch(option.href);
        const text = response.ok ? await response.text() : window.location.href;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // Clipboard unavailable; leave the control unchanged.
      }
      return;
    }

    window.open(option.href, option.target, option.target === '_blank' ? 'noreferrer' : undefined);
  };

  const optionIcon = (option: ResolvedContextualOption, showCopied = false) =>
    showCopied && copied ? <Check className="size-3.5" /> : <ConfiguredIcon icon={option.icon} />;

  return (
    <div className="inline-flex shrink-0 items-stretch">
      <Button
        variant="outline"
        size="sm"
        className="rounded-r-none bg-card text-foreground only:rounded-md"
        onClick={() => runOption(primary)}
      >
        {optionIcon(primary, primary.action === 'copy')}
        {primary.action === 'copy' && copied ? labels.copied : primary.title}
      </Button>
      {options.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-l-none border-l-0 bg-card"
                aria-label={labels.moreOptions}
              />
            }
          >
            <ChevronRight className="size-3.5 rotate-90" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            {options.map(option => (
              <DropdownMenuItem
                key={option.key}
                className="flex-row items-start gap-2 px-2.5 py-1.5"
                onClick={() => runOption(option)}
              >
                <span className="mt-0.5">{optionIcon(option)}</span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[0.85rem] font-medium text-foreground">{option.title}</span>
                  {option.description ? (
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  ) : null}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
