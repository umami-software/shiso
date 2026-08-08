import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import classNames from 'classnames';
import type { ComponentProps } from 'react';

export type ScrollAreaProps = ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  scrollbars?: 'vertical' | 'horizontal' | 'both';
};

export function ScrollArea({
  className,
  children,
  scrollbars = 'vertical',
  ...props
}: ScrollAreaProps) {
  const hasHorizontalScrollbar = scrollbars === 'horizontal' || scrollbars === 'both';

  return (
    <ScrollAreaPrimitive.Root
      className={classNames(
        'group/scrollarea relative overflow-hidden [--scroll-area-corner-height:0px] [--scroll-area-corner-width:0px]',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="box-border h-full w-full max-w-full rounded-[inherit] overscroll-contain">
        <ScrollAreaPrimitive.Content
          className={classNames(
            'box-border min-w-0',
            hasHorizontalScrollbar ? 'w-max min-w-full max-w-none' : 'w-full max-w-full',
          )}
        >
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      {scrollbars !== 'horizontal' && <ScrollBar />}
      {hasHorizontalScrollbar && <ScrollBar orientation="horizontal" />}
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
        'absolute z-[1] flex touch-none rounded-full bg-muted opacity-0 transition-opacity duration-150 select-none group-hover/scrollarea:opacity-100 data-[hovering]:opacity-100 data-[scrolling]:opacity-100',
        orientation === 'vertical'
          ? 'inset-y-0 right-0 w-1.5 flex-col p-px'
          : 'right-0 bottom-0 left-0 h-1.5 flex-row p-px',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb className="relative shrink-0 rounded-full bg-input transition-colors hover:bg-muted-foreground" />
    </ScrollAreaPrimitive.Scrollbar>
  );
}
