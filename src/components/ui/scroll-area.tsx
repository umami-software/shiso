import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import classNames from 'classnames';
import type { ComponentProps } from 'react';
import styles from './scroll-area.module.css';

export type ScrollAreaProps = ComponentProps<typeof ScrollAreaPrimitive.Root>;

export function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root className={classNames(styles.root, className)} {...props}>
      <ScrollAreaPrimitive.Viewport className={styles.viewport}>
        <ScrollAreaPrimitive.Content className={styles.content}>
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

export type ScrollBarProps = ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>;

export function ScrollBar({ className, orientation = 'vertical', ...props }: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      orientation={orientation}
      className={classNames(
        styles.scrollbar,
        orientation === 'vertical' ? styles.scrollbarVertical : styles.scrollbarHorizontal,
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb className={styles.thumb} />
    </ScrollAreaPrimitive.Scrollbar>
  );
}
