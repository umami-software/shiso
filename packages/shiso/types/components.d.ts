import type { ComponentProps, ImgHTMLAttributes, ReactElement, ReactNode } from 'react';
import type { Link as RouterLink } from 'react-router';

export interface AccordionProps {
  title?: ReactNode;
  icon?: ReactNode | string;
  defaultOpen?: boolean;
  children?: ReactNode;
}

export interface AccordionGroupProps {
  children?: ReactNode;
  defaultOpen?: boolean;
}

export declare function Accordion(props: AccordionProps): ReactElement;
export declare function AccordionGroup(props: AccordionGroupProps): ReactElement | null;

export type BadgeColor =
  | 'gray'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'purple'
  | 'white'
  | 'surface'
  | 'white-destructive'
  | 'surface-destructive';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type BadgeShape = 'rounded' | 'pill';

export interface BadgeProps {
  color?: BadgeColor;
  size?: BadgeSize;
  shape?: BadgeShape;
  icon?: ReactNode;
  stroke?: boolean;
  disabled?: boolean;
  className?: string;
  /** @deprecated Use `color` instead. */
  tone?: 'muted' | 'primary';
  children?: ReactNode;
}

export declare function Badge(props: BadgeProps): ReactElement;

export interface ButtonProps {
  href?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  size?: 'default' | 'xs' | 'sm' | 'lg';
  icon?: ReactNode | string;
  className?: string;
  children?: ReactNode;
}

export declare function Button(props: ButtonProps): ReactElement;

export type CalloutVariant = 'note' | 'tip' | 'warning' | 'info' | 'check' | 'danger';

export interface CalloutProps {
  title?: ReactNode;
  icon?: ReactNode | string;
  children?: ReactNode;
  variant?: CalloutVariant;
}

export interface ChildrenProps {
  children?: ReactNode;
}

export declare function Callout(props: CalloutProps): ReactElement;
export declare function Note(props: ChildrenProps): ReactElement;
export declare function Tip(props: ChildrenProps): ReactElement;
export declare function Warning(props: ChildrenProps): ReactElement;
export declare function Info(props: ChildrenProps): ReactElement;
export declare function Check(props: ChildrenProps): ReactElement;
export declare function Danger(props: ChildrenProps): ReactElement;
export declare function WarningBanner(props: ChildrenProps): ReactElement;

export type CardType = 'note' | 'info' | 'warning' | 'tip' | 'check' | 'danger';

export interface CardProps {
  title?: ReactNode;
  href?: string;
  icon?: ReactNode | string;
  color?: string;
  img?: string;
  cta?: string;
  horizontal?: boolean;
  arrow?: boolean;
  type?: CardType;
  children?: ReactNode;
}

export interface CardGroupProps {
  children?: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export declare function Card(props: CardProps): ReactElement;
export declare function CardGroup(props: CardGroupProps): ReactElement;

export interface CodeGroupProps {
  children?: ReactNode;
}

export declare function CodeGroup(props: CodeGroupProps): ReactElement | null;

export interface ColumnsProps {
  children?: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export interface ColumnProps {
  children?: ReactNode;
}

export declare function Columns(props: ColumnsProps): ReactElement;
export declare function Column(props: ColumnProps): ReactElement;

export interface ExpandableProps {
  title: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
}

export declare function Expandable(props: ExpandableProps): ReactElement;

export interface FrameProps {
  caption?: ReactNode;
  hint?: ReactNode;
  children?: ReactNode;
}

export declare function Frame(props: FrameProps): ReactElement;

export interface IconProps {
  icon?: string;
  src?: string;
  color?: string;
  size?: number;
  className?: string;
}

export declare function Icon(props: IconProps): ReactElement | null;

export interface ParamFieldProps {
  name?: string;
  query?: string;
  path?: string;
  header?: string;
  body?: string;
  type?: string;
  required?: boolean;
  children?: ReactNode;
}

export declare function ParamField(props: ParamFieldProps): ReactElement;
export declare function Param(props: ChildrenProps): ReactElement;

export interface PropertiesTableProps {
  children?: ReactNode;
}

export declare function PropertiesTable(props: PropertiesTableProps): ReactElement | null;

type FieldValue = string | number | boolean | null | undefined;

export interface ResponseFieldProps {
  name: string;
  type?: FieldValue;
  default?: FieldValue;
  required?: boolean;
  deprecated?: boolean;
  children?: ReactNode;
}

export declare function ResponseField(props: ResponseFieldProps): ReactElement;

export interface StepProps {
  title?: ReactNode;
  children?: ReactNode;
}

export interface StepsProps {
  children?: ReactNode;
}

export declare function Step(props: StepProps): ReactElement;
export declare function Steps(props: StepsProps): ReactElement | null;

export interface TabProps {
  title?: ReactNode;
  children?: ReactNode;
}

export interface TabsProps {
  children?: ReactNode;
  group?: string;
}

export declare function Tab(props: TabProps): ReactElement;
export declare function Tabs(props: TabsProps): ReactElement | null;

export interface TooltipProps {
  tip?: ReactNode;
  children?: ReactNode;
}

export declare function Tooltip(props: TooltipProps): ReactElement;

export interface UpdateRss {
  title?: string;
  description?: string;
}

export interface UpdateProps {
  label: string;
  description?: ReactNode;
  tags?: string[];
  rss?: UpdateRss;
  children?: ReactNode;
}

export declare function Update(props: UpdateProps): ReactElement;

export interface ChangelogProps {
  children?: ReactNode;
}

export declare function Changelog(props: ChangelogProps): ReactElement;

export type MermaidPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface MermaidProps {
  chart?: string;
  title?: ReactNode;
  actions?: boolean;
  placement?: MermaidPlacement;
  children?: ReactNode;
}

export declare function Mermaid(props: MermaidProps): ReactElement;

export interface PanelProps {
  children?: ReactNode;
}

export declare function Panel(props: PanelProps): ReactElement;

export interface TileProps {
  href: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  target?: '_self' | '_blank';
}

export interface TilesProps {
  children?: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export declare function Tile(props: TileProps): ReactElement;
export declare function Tiles(props: TilesProps): ReactElement;

export interface TreeFolderProps {
  name: string;
  defaultOpen?: boolean;
  openable?: boolean;
  highlight?: boolean;
  children?: ReactNode;
}

export interface TreeFileProps {
  name: string;
  highlight?: boolean;
}

export interface TreeProps {
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export declare function Tree(props: TreeProps): ReactElement;
export declare function FileTree(props: TreeProps): ReactElement;
export declare function TreeFolder(props: TreeFolderProps): ReactElement;
export declare function TreeFile(props: TreeFileProps): ReactElement;

export interface ZoomableImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  noZoom?: boolean;
}

export declare function ZoomableImage(props: ZoomableImageProps): ReactElement;

/** Client-side navigation link bound to Shiso's router. */
export type LinkProps = ComponentProps<typeof RouterLink>;
export declare function Link(props: LinkProps): ReactElement;
