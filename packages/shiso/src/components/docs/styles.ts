/** Shared Tailwind utility groups for the built-in MDX components. */
export const styles = {
  /* Accordions keep the native shadcn look: no outer box, hairline separators,
     small medium-weight triggers with hover underline. Only margins are added.
     The trigger header is an <h3> and panel text renders as <p>, so the
     .docs-markdown typography margins must be cancelled for those elements. */
  accordion: 'my-3 [&_h3:has(>[data-slot=accordion-trigger])]:m-0',
  accordionGroup: 'my-4 [&_h3:has(>[data-slot=accordion-trigger])]:m-0',
  accordionItem: '',
  accordionTrigger: 'text-foreground',
  accordionContent: 'text-muted-foreground [&_p]:mt-0 [&_p:last-child]:mb-0',
  expandableTrigger: 'items-center py-3 text-sm font-normal text-foreground hover:no-underline',
  /* Indent by chevron width + gap so body text lines up with the title. */
  expandableContent: 'pl-6',

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

  card: 'block h-full gap-0 rounded-lg border border-border p-4 text-sm ring-0 hover:border-primary',
  /* Typed cards bring their own tinted background; plain cards get the surface tint. */
  cardPlain: 'bg-card',
  cardHorizontal:
    '[&_[data-slot=card-inner]]:items-center [&_[data-slot=card-main]]:flex-row [&_[data-slot=card-main]]:items-center [&_[data-slot=card-main]]:gap-3 [&_[data-slot=card-body]]:m-0 [&_[data-slot=card-header]]:flex-row [&_[data-slot=card-header]]:items-center [&_[data-slot=card-header]]:gap-2',
  cardTyped:
    '[&_[data-slot=card-title]]:text-inherit [&_[data-slot=card-body]]:text-inherit [&_[data-slot=card-cta]]:text-inherit [&_[data-slot=card-arrow]]:text-inherit',
  cardImageLayout: 'p-0 [&_[data-slot=card-inner]]:p-6',
  cardImage: 'block aspect-video w-full border-border border-b object-cover',
  cardInner: 'flex items-start justify-between gap-3',
  cardMain: 'flex min-w-0 flex-col gap-2',
  cardHeader: 'flex flex-col items-start gap-3',
  cardIcon: 'inline-flex shrink-0 items-center justify-center [&_img]:size-6 [&_svg]:size-6',
  cardTitle: 'text-sm font-semibold text-foreground',
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
  fieldGroup:
    'my-4 divide-y divide-border overflow-hidden rounded-lg border border-border text-sm leading-6 [&>[data-slot=field-group-item]]:my-0 [&>[data-slot=field-group-item]]:px-4 [&>[data-slot=field-group-item]]:py-3 [&_[data-slot=field-group-body]]:mt-2 [&_[data-slot=field-group-type]]:text-xs',
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

  update:
    'my-8 grid scroll-mt-24 grid-cols-1 gap-4 border-border border-t pt-6 md:grid-cols-[220px_minmax(0,1fr)]',
  updateMeta: 'flex min-w-0 flex-col items-start gap-2 md:sticky md:top-24 md:self-start',
  updateLabel:
    'w-fit text-lg font-semibold text-foreground hover:text-primary hover:underline [&:hover]:decoration-primary',
  updateDescription: 'text-sm text-muted-foreground leading-6',
  updateTags: 'flex flex-wrap gap-1.5',
  updateBody: 'min-w-0 [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_:where(p,ul,ol)]:leading-7',
  changelog: 'my-4 flex flex-col',
  changelogFilters: 'mb-2 flex flex-wrap items-center gap-1',
  changelogFilterButton:
    'rounded-md p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring [&>[data-slot=badge]]:cursor-pointer',
  changelogClear:
    'ml-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:underline',
  changelogEmpty: 'my-6 text-sm text-muted-foreground',

  mermaid: 'my-4',
  mermaidTitle: 'mb-2 text-sm font-semibold text-foreground',
  mermaidViewport:
    'relative overflow-auto rounded-lg border border-border bg-card p-4 [&_svg]:mx-auto [&_svg]:max-w-full [&_svg]:shrink-0',
  mermaidSvg: 'origin-top-left transition-transform duration-150 [&_svg]:h-auto [&_svg]:max-w-none',
  mermaidFallback: 'bg-transparent p-0 font-mono text-xs text-muted-foreground whitespace-pre-wrap',
  mermaidError: 'mt-2 text-sm text-destructive',
  mermaidControls:
    'absolute flex items-center gap-1 rounded-md border border-border bg-background/90 p-1 shadow-sm [&_button]:flex [&_button]:size-6 [&_button]:items-center [&_button]:justify-center [&_button]:rounded [&_button]:text-sm [&_button]:text-muted-foreground [&_button:hover]:bg-muted [&_button:hover]:text-foreground',

  panel: 'flex min-w-0 flex-col gap-4 text-sm [&>:first-child]:mt-0 [&>:last-child]:mb-0',
  panelInline: 'my-4 lg:hidden',

  tile: 'block h-full overflow-hidden rounded-lg border border-border bg-card hover:border-primary',
  tilePreview:
    'flex h-36 items-center justify-center gap-2 overflow-hidden border-border border-b bg-muted/40 bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[size:16px_16px] p-4 [&_img]:max-h-full [&_img]:w-auto [&_img]:max-w-full [&_img]:object-contain',
  tileBody: 'flex flex-col gap-1 p-4',
  tileTitle: 'text-sm font-semibold text-foreground',
  tileDescription: 'text-sm text-muted-foreground leading-6',

  tree: 'not-prose my-4 overflow-hidden rounded-lg border border-border bg-card text-sm',
  treeList: 'flex flex-col gap-0.5 p-3',
  treeGroup: 'my-0 ml-[15px] flex list-none flex-col gap-px border-border border-l pl-1',
  treeItem: 'my-0 min-w-0 list-none p-0 [&::marker]:content-none',
  treeRow:
    'flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1 text-left text-foreground hover:bg-muted [&:focus-visible]:bg-muted [&:focus-visible]:ring-2 [&:focus-visible]:ring-ring [&:focus-visible]:outline-none',
  treeChevron: 'shrink-0 text-muted-foreground transition-transform [&[data-open]]:rotate-90',
  treeIcon: 'shrink-0 text-muted-foreground',
  treeName: 'min-w-0 flex-1 truncate font-mono text-[0.85rem]',
  treeHighlight: 'bg-primary/10 text-primary [&_svg]:text-primary',
} as const;
