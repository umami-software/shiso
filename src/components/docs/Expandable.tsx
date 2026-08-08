import type { ReactNode } from 'react';
import { ChevronRight } from '@/components/icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { styles } from './styles';

export interface ExpandableProps {
  title: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
}

export function Expandable({ title, children, defaultOpen = false }: ExpandableProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} className={styles.accordion}>
      <div className={styles.accordionItem}>
        <CollapsibleTrigger
          className={`${styles.accordionTrigger} group/collapsible-trigger flex w-full justify-between text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50`}
        >
          {title}
          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-aria-expanded/collapsible-trigger:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className={styles.accordionContent}>{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
