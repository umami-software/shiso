'use client';

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';

import { cn } from '@/lib/utils';

type ScrollAreaProps = ScrollAreaPrimitive.Root.Props & {
  scrollbars?: 'vertical' | 'horizontal' | 'both';
};

function ScrollArea({ className, children, scrollbars = 'vertical', ...props }: ScrollAreaProps) {
  const hasHorizontalScrollbar = scrollbars === 'horizontal' || scrollbars === 'both';

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(
        'group/scrollarea relative overflow-hidden [--scroll-area-corner-height:0px] [--scroll-area-corner-width:0px]',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="box-border h-full w-full max-w-full rounded-[inherit] overscroll-contain outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
      >
        <ScrollAreaPrimitive.Content
          data-slot="scroll-area-content"
          className={cn(
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

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'absolute z-[1] flex touch-none rounded-full bg-muted opacity-0 transition-opacity duration-150 select-none group-hover/scrollarea:opacity-100 data-[hovering]:opacity-100 data-[scrolling]:opacity-100',
        orientation === 'vertical'
          ? 'inset-y-0 right-0 w-1.5 flex-col p-px'
          : 'right-0 bottom-0 left-0 h-1.5 flex-row p-px',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative shrink-0 rounded-full bg-input transition-colors hover:bg-muted-foreground"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, type ScrollAreaProps, ScrollBar };
