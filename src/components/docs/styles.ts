/** Shared Tailwind utility groups for the built-in MDX components. */
export const styles = {
  accordionGroup:
    'my-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] [&>details]:m-0 [&>details]:rounded-none [&>details]:border-0 [&>details+details]:border-t [&>details+details]:border-t-[var(--color-border)]',
  details:
    'group my-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]',
  summary:
    "flex cursor-pointer list-none select-none items-center gap-2 px-4 py-3 font-semibold text-[var(--color-text-strong)] before:size-[0.5em] before:shrink-0 before:rotate-[-45deg] before:border-r-2 before:border-b-2 before:border-[var(--color-text-muted)] before:content-[''] group-open:before:rotate-45 [&::-webkit-details-marker]:hidden",
  detailsBody: 'px-4 pb-4',

  callout:
    'my-4 flex items-start gap-3 rounded-[var(--radius-lg)] border px-4 py-3.5 text-base leading-6',
  calloutIcon:
    'mt-[calc((1.5em-1.25rem)/2)] inline-flex size-5 shrink-0 items-center justify-center [&_svg]:block [&_svg]:size-4',
  calloutBody:
    'flex min-w-0 flex-1 flex-col gap-[0.35rem] [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_:where(p,ul,ol)]:my-[0.35rem] [&>:where(p,ul,ol):first-child]:mt-0 [&>:where(p,ul,ol):last-child]:mb-0',
  calloutTitle: 'font-semibold leading-6',
  note: 'border-[var(--callout-note-border)] bg-[var(--callout-note-bg)] text-[var(--callout-note-text)]',
  info: 'border-[var(--callout-info-border)] bg-[var(--callout-info-bg)] text-[var(--callout-info-text)]',
  warning:
    'border-[var(--callout-warning-border)] bg-[var(--callout-warning-bg)] text-[var(--callout-warning-text)]',
  tip: 'border-[var(--callout-tip-border)] bg-[var(--callout-tip-bg)] text-[var(--callout-tip-text)]',
  check:
    'border-[var(--callout-check-border)] bg-[var(--callout-check-bg)] text-[var(--callout-check-text)]',
  danger:
    'border-[var(--callout-danger-border)] bg-[var(--callout-danger-bg)] text-[var(--callout-danger-text)]',

  card: 'block h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 no-underline hover:border-[var(--color-border-strong)] hover:no-underline active:no-underline',
  cardHorizontal:
    '[&_[data-slot=card-main]]:flex-row [&_[data-slot=card-main]]:items-center [&_[data-slot=card-main]]:gap-3 [&_[data-slot=card-body]]:m-0',
  cardImage: 'mb-3 block w-full rounded-[var(--radius-md)]',
  cardInner: 'flex items-start justify-between gap-3',
  cardMain: 'flex min-w-0 flex-col gap-2',
  cardHeader: 'flex items-center gap-2',
  cardTitle: 'text-[1.1rem] font-semibold text-[var(--color-text-strong)]',
  cardBody: 'text-[var(--color-text-muted)]',
  cardCta:
    'flex shrink-0 items-center gap-[0.35rem] text-[0.9rem] font-medium text-[var(--color-text-muted)]',
  cardArrow: 'shrink-0 text-[var(--color-text-muted)]',

  grid: 'my-4 grid grid-cols-1 gap-4',
  gridCols1: 'md:grid-cols-1',
  gridCols2: 'md:grid-cols-2',
  gridCols3: 'md:grid-cols-3',
  gridCols4: 'md:grid-cols-4',
  column: 'min-w-0 [&>:first-child]:mt-0 [&>:last-child]:mb-0',
  icon: 'inline-block align-[-0.145em]',

  tabs: 'my-4',
  tabList: 'flex gap-1 overflow-x-auto border-[var(--color-border)] border-b',
  tabButton:
    '-mb-px whitespace-nowrap border-transparent border-b-2 px-[0.85rem] py-2 font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]',
  tabSelected: 'border-b-[var(--color-primary)] text-[var(--color-text-strong)]',
  tabPanel: 'pt-4',

  frame:
    'my-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] p-4',
  frameCaption: 'mt-3 text-[0.9rem] text-[var(--color-text-muted)]',

  field:
    'my-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4',
  fieldHeader: 'flex flex-wrap items-center gap-2',
  fieldBody: 'mt-3',
  fieldType: 'text-[0.9rem] text-[var(--color-text-muted)]',
  fieldName: 'font-bold text-[var(--color-text-strong)]',
  code: 'rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,currentColor_10%,transparent)] px-[0.35rem] py-[0.1rem] text-[0.9em] text-[var(--color-text-strong)] [font-family:var(--font-mono)]',
  badge:
    'inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-[0.1rem] text-xs font-medium text-[var(--color-text-muted)]',
  badgePrimary:
    'border-[var(--color-primary)] bg-[var(--color-surface-sunken)] text-[var(--color-primary)]',

  example:
    'my-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] p-4',
  exampleHeader: 'flex items-center gap-2 font-semibold text-[var(--color-text-strong)]',
  exampleBody: 'mt-3',

  steps:
    "relative my-4 flex flex-col gap-5 before:absolute before:top-4 before:bottom-4 before:left-4 before:w-px before:-translate-x-1/2 before:bg-[var(--color-border)] before:content-['']",
  step: 'relative flex items-start gap-4',
  stepNumber:
    'relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[0.9rem] font-semibold text-[var(--color-text-strong)]',
  stepContent: 'flex min-w-0 grow flex-col gap-2',
  stepTitle: 'text-[1.1rem] font-semibold text-[var(--color-text-strong)]',

  tooltip: 'group relative inline-block',
  tooltipTrigger:
    'peer cursor-help border-0 border-[var(--color-text-muted)] border-b border-dotted bg-transparent p-0 text-inherit [font:inherit]',
  tooltipBubble:
    'invisible absolute bottom-[calc(100%+0.5rem)] left-1/2 z-10 w-max max-w-72 -translate-x-1/2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[0.85rem] font-normal text-[var(--color-text)] leading-[1.4] opacity-0 shadow-[0_4px_12px_rgb(0_0_0/12%)] transition-opacity duration-150 group-hover:visible group-hover:opacity-100 peer-focus-visible:visible peer-focus-visible:opacity-100',
} as const;
