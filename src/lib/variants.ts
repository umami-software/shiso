import { tv, type VariantProps } from 'tailwind-variants';

// Layout variants

export const container = tv({
  base: 'mx-auto w-full max-w-screen-xl px-4',
});

export const row = tv({
  base: 'flex flex-row',
  variants: {
    gap: {
      true: 'gap-3',
      '1': 'gap-1',
      '2': 'gap-2',
      '3': 'gap-3',
      '4': 'gap-4',
      '5': 'gap-5',
      '6': 'gap-6',
      '7': 'gap-7',
      '8': 'gap-8',
      '9': 'gap-9',
      '10': 'gap-10',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
    alignItems: {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    justifyContent: {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    padding: {
      '1': 'p-1',
      '2': 'p-2',
      '3': 'p-3',
      '4': 'p-4',
      '5': 'p-5',
      '6': 'p-6',
      '7': 'p-7',
      '8': 'p-8',
    },
    paddingX: {
      '1': 'px-1',
      '2': 'px-2',
      '3': 'px-3',
      '4': 'px-4',
      '5': 'px-5',
      '6': 'px-6',
      '7': 'px-7',
      '8': 'px-8',
    },
    paddingY: {
      '1': 'py-1',
      '2': 'py-2',
      '3': 'py-3',
      '4': 'py-4',
      '5': 'py-5',
      '6': 'py-6',
      '7': 'py-7',
      '8': 'py-8',
    },
  },
});

export const column = tv({
  base: 'flex flex-col',
  variants: {
    gap: {
      true: 'gap-3',
      '1': 'gap-1',
      '2': 'gap-2',
      '3': 'gap-3',
      '4': 'gap-4',
      '5': 'gap-5',
      '6': 'gap-6',
      '7': 'gap-7',
      '8': 'gap-8',
      '9': 'gap-9',
      '10': 'gap-10',
    },
    alignItems: {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    justifyContent: {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    minHeight: {
      screen: 'min-h-screen',
      full: 'min-h-full',
      '100vh': 'min-h-[100vh]',
    },
    padding: {
      '1': 'p-1',
      '2': 'p-2',
      '3': 'p-3',
      '4': 'p-4',
      '5': 'p-5',
      '6': 'p-6',
      '7': 'p-7',
      '8': 'p-8',
    },
    paddingY: {
      '1': 'py-1',
      '2': 'py-2',
      '3': 'py-3',
      '4': 'py-4',
      '5': 'py-5',
      '6': 'py-6',
      '7': 'py-7',
      '8': 'py-8',
    },
  },
});

export const box = tv({
  base: '',
  variants: {
    padding: {
      '1': 'p-1',
      '2': 'p-2',
      '3': 'p-3',
      '4': 'p-4',
      '5': 'p-5',
      '6': 'p-6',
      '7': 'p-7',
      '8': 'p-8',
    },
    paddingX: {
      '1': 'px-1',
      '2': 'px-2',
      '3': 'px-3',
      '4': 'px-4',
      '5': 'px-5',
      '6': 'px-6',
      '7': 'px-7',
      '8': 'px-8',
    },
    paddingY: {
      '1': 'py-1',
      '2': 'py-2',
      '3': 'py-3',
      '4': 'py-4',
      '5': 'py-5',
      '6': 'py-6',
      '7': 'py-7',
      '8': 'py-8',
    },
    marginY: {
      '1': 'my-1',
      '2': 'my-2',
      '3': 'my-3',
      '4': 'my-4',
      '5': 'my-5',
      '6': 'my-6',
      '7': 'my-7',
      '8': 'my-8',
    },
    maxWidth: {
      full: 'max-w-full',
      '100vw': 'max-w-[100vw]',
    },
    overflowX: {
      auto: 'overflow-x-auto',
      hidden: 'overflow-x-hidden',
      scroll: 'overflow-x-scroll',
    },
    overflowY: {
      auto: 'overflow-y-auto',
      hidden: 'overflow-y-hidden',
      scroll: 'overflow-y-scroll',
    },
  },
});

// Typography variants

export const text = tv({
  base: 'text-foreground',
  variants: {
    size: {
      '1': 'text-xs',
      '2': 'text-sm',
      '3': 'text-base',
      '4': 'text-lg',
      '5': 'text-xl',
      '6': 'text-2xl',
      '7': 'text-3xl',
      '8': 'text-4xl',
    },
    weight: {
      thin: 'font-thin',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    },
    spacing: {
      '1': 'tracking-tighter',
      '2': 'tracking-tight',
      '3': 'tracking-normal',
      '4': 'tracking-wide',
      '5': 'tracking-wider',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted',
      primary: 'text-primary',
      success: 'text-success',
      danger: 'text-danger',
      warning: 'text-warning',
    },
  },
});

export const heading = tv({
  base: 'font-bold text-foreground tracking-tight',
  variants: {
    size: {
      '1': 'text-base',
      '2': 'text-xl',
      '3': 'text-2xl',
      '4': 'text-3xl',
      '5': 'text-4xl',
      '6': 'text-5xl',
    },
  },
  defaultVariants: {
    size: '3',
  },
});

// Button variants

export const button = tv({
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-base-3 text-foreground hover:bg-base-4',
      outline: 'border border-border bg-transparent hover:bg-base-2',
      ghost: 'hover:bg-base-2',
      quiet: 'bg-transparent hover:bg-base-2',
      link: 'text-primary underline-offset-4 hover:underline',
      danger: 'bg-danger text-danger-foreground hover:bg-danger/90',
    },
    size: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

// Icon variants

export const icon = tv({
  base: 'inline-block shrink-0',
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    fillColor: {
      true: 'fill-current',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Callout variants

export const callout = tv({
  base: 'flex items-center gap-3 rounded-md border p-4',
  variants: {
    variant: {
      note: 'border-border bg-base-2',
      warning: 'border-warning/50 bg-warning/10 text-warning',
      info: 'border-info/50 bg-info/10 text-info',
      tip: 'border-success/50 bg-success/10 text-success',
      check: 'border-success/50 bg-success/10 text-success',
      danger: 'border-danger/50 bg-danger/10 text-danger',
    },
  },
  defaultVariants: {
    variant: 'note',
  },
});

// CodeBlock variants

export const codeBlock = tv({
  slots: {
    container:
      'relative rounded-md border border-border bg-background p-5 font-mono text-sm whitespace-pre-wrap break-words',
    copyButton:
      'absolute right-5 top-5 cursor-pointer border-0 bg-transparent p-0',
    copyIcon: 'text-base-4 hover:text-base-1',
    checkIcon: 'text-success',
  },
});

// SideNav variants

export const sideNav = tv({
  slots: {
    nav: 'min-w-60 overflow-y-auto scrollbar-thin scrollbar-track-border scrollbar-thumb-foreground',
    sticky: 'sticky top-8',
    header: 'py-2 font-bold',
    items: 'flex flex-col',
    item: 'border-l border-border px-3 py-2 text-muted no-underline transition-colors hover:text-foreground',
    selected: 'border-primary bg-base-2 font-medium text-foreground',
  },
});

// PageLinks variants

export const pageLinks = tv({
  slots: {
    container: 'sticky top-8 h-max min-w-60',
    link: 'block text-sm text-muted no-underline hover:text-primary',
    selected: 'text-primary',
  },
  variants: {
    indent: {
      '1': { link: 'ml-0' },
      '2': { link: 'ml-0' },
      '3': { link: 'ml-2.5' },
      '4': { link: 'ml-5' },
      '5': { link: 'ml-7.5' },
      '6': { link: 'ml-10' },
    },
  },
});

// Markdown content variants

export const markdown = tv({
  slots: {
    content: 'mb-16 text-base prose prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:font-semibold prose-a:underline prose-a:decoration-border prose-a:underline-offset-4 hover:prose-a:decoration-primary prose-img:mx-auto prose-img:my-16 prose-img:shadow-md prose-h1:text-4xl prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-7 prose-h3:mb-4 prose-ul:list-disc prose-ol:list-decimal prose-code:rounded prose-code:bg-base-1 prose-code:px-1 prose-code:font-bold prose-code:text-sm prose-pre:my-5 max-w-none',
  },
});

// Tabs variants

export const tabs = tv({
  slots: {
    root: 'flex flex-col',
    list: 'flex border-b border-border',
    tab: 'cursor-pointer border-b-2 border-transparent px-4 py-2 text-muted transition-colors hover:text-foreground',
    activeTab: 'border-primary text-foreground',
  },
});

// Type exports
export type ContainerVariants = VariantProps<typeof container>;
export type RowVariants = VariantProps<typeof row>;
export type ColumnVariants = VariantProps<typeof column>;
export type BoxVariants = VariantProps<typeof box>;
export type TextVariants = VariantProps<typeof text>;
export type HeadingVariants = VariantProps<typeof heading>;
export type ButtonVariants = VariantProps<typeof button>;
export type IconVariants = VariantProps<typeof icon>;
export type CalloutVariants = VariantProps<typeof callout>;
