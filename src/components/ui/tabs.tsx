import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import classNames from 'classnames';
import type { ComponentProps } from 'react';

export function Tabs({ className, ...props }: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={classNames('my-4 flex min-w-0 flex-col', className)}
      {...props}
    />
  );
}

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={classNames(
        'flex w-full items-center gap-7 overflow-x-auto overflow-y-hidden border-border border-b [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Tab>) {
  return (
    <TabsPrimitive.Tab
      className={classNames(
        '-mb-px inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-transparent border-b-2 py-2 font-medium text-sm text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 data-[active]:border-b-primary data-[active]:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      className={classNames(
        'pt-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2',
        className,
      )}
      {...props}
    />
  );
}
