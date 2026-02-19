import {
  Box,
  Text,
  Accordion as ZenAccordion,
  AccordionItem as ZenAccordionItem,
} from '@umami/react-zen';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { toElementArray } from './utils';

interface MintlifyAccordionChildProps {
  title?: ReactNode;
  children?: ReactNode;
}

export function Accordion({ children }: MintlifyAccordionChildProps) {
  return <>{children}</>;
}

export interface AccordionGroupProps {
  children?: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionGroup({ children, defaultOpen = false }: AccordionGroupProps) {
  const items = useMemo(() => {
    return toElementArray<MintlifyAccordionChildProps>(children).map((child, index) => {
      return {
        id: `accordion-${index + 1}`,
        title: child.props.title || `Section ${index + 1}`,
        content: child.props.children,
      };
    });
  }, [children]);

  if (!items.length) {
    return null;
  }

  const defaultExpandedKeys = defaultOpen ? [items[0].id] : [];

  return (
    <Box marginY="4">
      <ZenAccordion type="multiple" defaultExpandedKeys={defaultExpandedKeys}>
        {items.map(item => {
          return (
            <ZenAccordionItem id={item.id} key={item.id}>
              <Text weight="semibold">{item.title}</Text>
              <Box paddingTop="3">{item.content}</Box>
            </ZenAccordionItem>
          );
        })}
      </ZenAccordion>
    </Box>
  );
}
