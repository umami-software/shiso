import type { ReactNode } from 'react';
import {
  TooltipContent,
  Tooltip as TooltipPrimitive,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { styles } from './styles';

export interface TooltipProps {
  tip?: ReactNode;
  children?: ReactNode;
}

export function Tooltip({ tip, children }: TooltipProps) {
  return (
    <TooltipPrimitive>
      <TooltipTrigger className={styles.tooltipTrigger}>{children}</TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </TooltipPrimitive>
  );
}
