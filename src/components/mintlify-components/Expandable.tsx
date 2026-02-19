import {
  Box,
  Row,
  Text,
  Accordion as ZenAccordion,
  AccordionItem as ZenAccordionItem,
} from '@umami/react-zen';
import type { ReactNode } from 'react';
import { useId } from 'react';

export interface ExpandableProps {
  title: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
}

export function Expandable({ title, children, defaultOpen = false }: ExpandableProps) {
  const id = useId();

  return (
    <Box marginY="3">
      <ZenAccordion type="single" defaultExpandedKeys={defaultOpen ? [id] : []}>
        <ZenAccordionItem id={id}>
          <Row alignItems="center" gap="2">
            <Text weight="semibold">{title}</Text>
          </Row>
          <Box paddingTop="3">{children}</Box>
        </ZenAccordionItem>
      </ZenAccordion>
    </Box>
  );
}
