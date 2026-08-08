import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import classNames from 'classnames';
import type { ComponentProps } from 'react';

export type ScrollAreaProps = ComponentProps<typeof ScrollAreaPrimitive.Root>;

export function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      className={classNames(
        'group/scrollarea relative overflow-hidden [--scroll-area-corner-height:0px] [--scroll-area-corner-width:0px]',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="box-border h-full w-full max-w-full rounded-[inherit] overscroll-contain">
        <ScrollAreaPrimitive.Content className="box-border w-full min-w-0 max-w-full">
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
        'absolute z-[1] flex touch-none opacity-0 transition-opacity duration-150 select-none group-hover/scrollarea:opacity-100 data-[hovering]:opacity-100 data-[scrolling]:opacity-100',
        orientation === 'vertical'
          ? 'inset-y-0 right-0 w-2.5 flex-col p-0.5'
          : 'right-0 bottom-0 left-0 h-2.5 flex-row p-0.5',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-[var(--radius-full)] bg-[var(--color-border-strong)] hover:bg-[var(--color-text-muted)]" />
    </ScrollAreaPrimitive.Scrollbar>
  );
}
