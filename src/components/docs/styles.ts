/** Shared Tailwind utility groups for the built-in MDX components. */
export const styles = {
  accordionGroup:
    'my-4 overflow-hidden rounded-lg border border-border [&>details]:m-0 [&>details]:rounded-none [&>details]:border-0 [&>details+details]:border-t [&>details+details]:border-t-border',
  details: 'group my-3 rounded-lg border border-border bg-card',
  summary:
    "flex cursor-pointer list-none select-none items-center gap-2 px-4 py-3 font-semibold text-foreground before:size-[0.5em] before:shrink-0 before:rotate-[-45deg] before:border-r-2 before:border-b-2 before:border-muted-foreground before:content-[''] group-open:before:rotate-45 [&::-webkit-details-marker]:hidden",
  detailsBody: 'px-4 pb-4',

  callout: 'my-4 flex items-start gap-3 rounded-lg border px-4 py-3.5 text-base leading-6',
  calloutIcon:
    'mt-[calc((1.5em-1.25rem)/2)] inline-flex size-5 shrink-0 items-center justify-center [&_svg]:block [&_svg]:size-4',
  calloutBody:
    'flex min-w-0 flex-1 flex-col gap-[0.35rem] [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_:where(p,ul,ol)]:my-[0.35rem] [&>:where(p,ul,ol):first-child]:mt-0 [&>:where(p,ul,ol):last-child]:mb-0',
  calloutTitle: 'font-semibold leading-6',
  note: 'border-border bg-muted text-foreground',
  info: 'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-400/40 dark:bg-blue-400/10 dark:text-blue-300',
  warning:
    'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300',
  tip: 'border-green-300 bg-green-50 text-green-900 dark:border-green-400/40 dark:bg-green-400/10 dark:text-green-300',
  check:
    'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300',
  danger: 'border-destructive/40 bg-destructive/10 text-destructive',

  card: 'block h-full rounded-lg border border-border bg-card p-4 no-underline hover:border-input hover:no-underline active:no-underline',
  cardHorizontal:
    '[&_[data-slot=card-main]]:flex-row [&_[data-slot=card-main]]:items-center [&_[data-slot=card-main]]:gap-3 [&_[data-slot=card-body]]:m-0',
  cardImage: 'mb-3 block w-full rounded-md',
  cardInner: 'flex items-start justify-between gap-3',
  cardMain: 'flex min-w-0 flex-col gap-2',
  cardHeader: 'flex items-center gap-2',
  cardTitle: 'text-[1.1rem] font-semibold text-foreground',
  cardBody: 'text-muted-foreground',
  cardCta:
    'flex shrink-0 items-center gap-[0.35rem] text-[0.9rem] font-medium text-muted-foreground',
  cardArrow: 'shrink-0 text-muted-foreground',

  grid: 'my-4 grid grid-cols-1 gap-4',
  gridCols1: 'md:grid-cols-1',
  gridCols2: 'md:grid-cols-2',
  gridCols3: 'md:grid-cols-3',
  gridCols4: 'md:grid-cols-4',
  column: 'min-w-0 [&>:first-child]:mt-0 [&>:last-child]:mb-0',
  icon: 'inline-block align-[-0.145em]',

  tabs: 'my-4',
  tabList: 'flex gap-1 overflow-x-auto border-border border-b',
  tabButton:
    '-mb-px whitespace-nowrap border-transparent border-b-2 px-[0.85rem] py-2 font-medium text-muted-foreground hover:text-foreground',
  tabSelected: 'border-b-primary text-foreground',
  tabPanel: 'pt-4',

  frame: 'my-4 rounded-lg border border-border bg-muted p-4',
  frameCaption: 'mt-3 text-[0.9rem] text-muted-foreground',

  field: 'my-3 rounded-lg border border-border bg-card p-4',
  fieldHeader: 'flex flex-wrap items-center gap-2',
  fieldBody: 'mt-3',
  fieldType: 'text-[0.9rem] text-muted-foreground',
  fieldName: 'font-bold text-foreground',
  code: 'rounded-sm bg-[color-mix(in_srgb,currentColor_10%,transparent)] px-[0.35rem] py-[0.1rem] text-sm text-foreground font-mono',
  badge:
    'inline-flex items-center rounded-full border border-border bg-card px-2 py-[0.1rem] text-xs font-medium text-muted-foreground',
  badgePrimary: 'border-primary bg-muted text-primary',

  example: 'my-4 rounded-lg border border-border bg-muted p-4',
  exampleHeader: 'flex items-center gap-2 font-semibold text-foreground',
  exampleBody: 'mt-3',

  steps:
    "relative my-4 flex flex-col gap-5 before:absolute before:top-4 before:bottom-4 before:left-4 before:w-px before:-translate-x-1/2 before:bg-border before:content-['']",
  step: 'relative flex items-start gap-4',
  stepNumber:
    'relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[0.9rem] font-semibold text-foreground',
  stepContent: 'flex min-w-0 grow flex-col gap-2',
  stepTitle: 'text-[1.1rem] font-semibold text-foreground',

  tooltip: 'group relative inline-block',
  tooltipTrigger:
    'peer cursor-help border-0 border-muted-foreground border-b border-dotted bg-transparent p-0 text-inherit [font:inherit]',
  tooltipBubble:
    'invisible absolute bottom-[calc(100%+0.5rem)] left-1/2 z-10 w-max max-w-72 -translate-x-1/2 rounded-md border border-border bg-card px-2.5 py-1.5 text-[0.85rem] font-normal text-foreground leading-[1.4] opacity-0 shadow-[0_4px_12px_rgb(0_0_0/12%)] transition-opacity duration-150 group-hover:visible group-hover:opacity-100 peer-focus-visible:visible peer-focus-visible:opacity-100',
} as const;
