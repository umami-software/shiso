/** Shared Tailwind utility groups for the built-in MDX components. */
export const styles = {
  accordion: 'my-3',
  accordionGroup:
    'my-4 overflow-hidden rounded-lg border border-border [&_[data-slot=accordion-item]]:rounded-none [&_[data-slot=accordion-item]]:border-0 [&_[data-slot=accordion-item]+[data-slot=accordion-item]]:border-t [&_[data-slot=accordion-trigger]]:rounded-none',
  accordionItem: 'rounded-lg border border-border bg-transparent',
  accordionTrigger:
    'items-center px-4 py-3 text-base font-semibold text-foreground hover:no-underline',
  accordionContent: 'px-4 pb-4 text-base leading-7',
  expandableTrigger:
    'items-center px-4 py-3 text-sm font-normal text-foreground hover:no-underline',

  callout: 'my-4 flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm leading-6',
  calloutIcon: 'flex h-6 w-5 shrink-0 items-center justify-center [&_svg]:block [&_svg]:size-4',
  calloutBody:
    'flex min-w-0 flex-1 flex-col gap-[0.35rem] [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_:where(p,ul,ol)]:my-[0.35rem] [&>:where(p,ul,ol):first-child]:mt-0 [&>:where(p,ul,ol):last-child]:mb-0',
  calloutDescription: 'text-sm text-inherit leading-6 [&>:first-child]:mt-0 [&>:last-child]:mb-0',
  calloutTitle: 'font-semibold leading-6',
  note: 'border-border bg-muted/50 text-foreground',
  info: 'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-400/40 dark:bg-blue-400/10 dark:text-blue-300',
  warning:
    'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300',
  tip: 'border-green-300 bg-green-50 text-green-900 dark:border-green-400/40 dark:bg-green-400/10 dark:text-green-300',
  check:
    'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300',
  danger: 'border-destructive/40 bg-destructive/10 text-destructive',

  card: 'block h-full gap-0 rounded-lg border border-border bg-transparent p-4 text-base ring-0 hover:border-input',
  cardHorizontal:
    '[&_[data-slot=card-inner]]:items-center [&_[data-slot=card-main]]:flex-row [&_[data-slot=card-main]]:items-center [&_[data-slot=card-main]]:gap-3 [&_[data-slot=card-body]]:m-0',
  cardTyped:
    '[&_[data-slot=card-title]]:text-inherit [&_[data-slot=card-body]]:text-inherit [&_[data-slot=card-cta]]:text-inherit [&_[data-slot=card-arrow]]:text-inherit',
  cardImageLayout: 'p-0 [&_[data-slot=card-inner]]:p-6',
  cardImage: 'block aspect-video w-full border-border border-b object-cover',
  cardInner: 'flex items-start justify-between gap-3',
  cardMain: 'flex min-w-0 flex-col gap-2',
  cardHeader: 'flex items-center gap-2',
  cardIcon: 'inline-flex shrink-0 items-center justify-center [&_img]:size-4 [&_svg]:size-4',
  cardTitle: 'text-base font-semibold text-foreground',
  cardBody: 'text-muted-foreground [&>:first-child]:mt-0 [&>:last-child]:mb-0',
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

  tabs: 'my-4 gap-0',

  frameWrapper: 'my-4',
  frameHint: 'mb-4 flex items-start gap-2 text-sm font-medium leading-5 text-foreground',
  frameHintIcon:
    'flex h-5 shrink-0 items-center text-muted-foreground [&_svg]:size-4 [&_svg]:fill-current',
  frame: 'relative overflow-hidden rounded-2xl border border-border bg-muted/25 p-2',
  frameContent:
    'relative flex justify-center overflow-hidden rounded-xl [&_p]:m-0 [&_img]:m-0 [&_img]:w-full [&_video]:w-full [&_[data-slot=zoomable-image]]:m-0 [&_[data-slot=zoomable-image]]:w-full',
  frameCaption:
    'relative mt-3 px-4 pb-1 text-center text-sm leading-5 text-muted-foreground [&_p]:m-0 [&_a]:font-semibold',

  field: 'my-3',
  paramField: 'my-3',
  fieldHeader: 'flex flex-wrap items-center gap-2',
  fieldBody: 'mt-3',
  fieldType: 'text-[0.9rem] text-muted-foreground',
  fieldName: 'font-bold text-foreground',
  code: 'rounded-sm bg-[color-mix(in_srgb,currentColor_4%,transparent)] px-[0.35rem] py-[0.1rem] text-sm text-foreground font-mono',
  steps:
    "relative my-4 flex flex-col gap-5 before:absolute before:top-4 before:bottom-4 before:left-4 before:w-px before:-translate-x-1/2 before:bg-border before:content-['']",
  step: 'relative flex items-start gap-4',
  stepNumber:
    'relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[0.9rem] font-semibold text-foreground',
  stepContent: 'flex min-w-0 grow flex-col gap-2',
  stepTitle: 'text-[1.1rem] font-semibold text-foreground',

  tooltipTrigger:
    'peer cursor-help border-0 border-muted-foreground border-b border-dotted bg-transparent p-0 text-inherit [font:inherit]',
} as const;
