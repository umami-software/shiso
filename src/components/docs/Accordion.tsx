import type { ReactNode } from 'react';
import {
  AccordionContent,
  AccordionItem,
  Accordion as AccordionPrimitive,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { styles } from './styles';
import { resolveIcon, toElementArray } from './utils';

export interface AccordionProps {
  title?: ReactNode;
  icon?: ReactNode | string;
  defaultOpen?: boolean;
  children?: ReactNode;
}

function AccordionSection({ value, title, icon, children }: AccordionProps & { value: string }) {
  return (
    <AccordionItem value={value} className={styles.accordionItem}>
      <AccordionTrigger className={styles.accordionTrigger}>
        <span className="flex min-w-0 items-center gap-2">
          {resolveIcon(icon)}
          {title}
        </span>
      </AccordionTrigger>
      <AccordionContent className={styles.accordionContent}>{children}</AccordionContent>
    </AccordionItem>
  );
}

export function Accordion({ title, icon, defaultOpen, children }: AccordionProps) {
  const value = 'accordion-item';

  return (
    <AccordionPrimitive defaultValue={defaultOpen ? [value] : []} className={styles.accordion}>
      <AccordionSection value={value} title={title} icon={icon}>
        {children}
      </AccordionSection>
    </AccordionPrimitive>
  );
}

export interface AccordionGroupProps {
  children?: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionGroup({ children, defaultOpen = false }: AccordionGroupProps) {
  const items = toElementArray<AccordionProps>(children);

  if (!items.length) {
    return null;
  }

  const values = items.map((_, index) => `accordion-${index + 1}`);
  const defaultValue = values.filter((_, index) => {
    return items[index].props.defaultOpen ?? (defaultOpen && index === 0);
  });

  return (
    <AccordionPrimitive multiple defaultValue={defaultValue} className={styles.accordionGroup}>
      {items.map((child, index) => (
        <AccordionSection key={child.key ?? values[index]} value={values[index]} {...child.props} />
      ))}
    </AccordionPrimitive>
  );
}
