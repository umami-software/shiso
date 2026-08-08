import type { ReactNode } from 'react';
import { Badge as BadgePrimitive } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { resolveIcon } from './utils';

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

const colorClasses: Record<BadgeColor | 'primary', { filled: string; stroke: string }> = {
  gray: {
    filled: 'border-transparent bg-muted text-muted-foreground',
    stroke: 'border-border bg-transparent text-muted-foreground',
  },
  blue: {
    filled: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300',
    stroke:
      'border-blue-300 bg-transparent text-blue-700 dark:border-blue-400/50 dark:text-blue-300',
  },
  green: {
    filled:
      'border-transparent bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300',
    stroke:
      'border-green-300 bg-transparent text-green-700 dark:border-green-400/50 dark:text-green-300',
  },
  yellow: {
    filled:
      'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-400/15 dark:text-yellow-300',
    stroke:
      'border-yellow-300 bg-transparent text-yellow-700 dark:border-yellow-400/50 dark:text-yellow-300',
  },
  orange: {
    filled:
      'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-400/15 dark:text-orange-300',
    stroke:
      'border-orange-300 bg-transparent text-orange-700 dark:border-orange-400/50 dark:text-orange-300',
  },
  red: {
    filled: 'border-transparent bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300',
    stroke: 'border-red-300 bg-transparent text-red-700 dark:border-red-400/50 dark:text-red-300',
  },
  purple: {
    filled:
      'border-transparent bg-purple-100 text-purple-800 dark:bg-purple-400/15 dark:text-purple-300',
    stroke:
      'border-purple-300 bg-transparent text-purple-700 dark:border-purple-400/50 dark:text-purple-300',
  },
  white: {
    filled: 'border-border bg-white text-zinc-900',
    stroke: 'border-white bg-transparent text-foreground dark:text-white',
  },
  surface: {
    filled: 'border-border bg-background text-foreground',
    stroke: 'border-border bg-transparent text-foreground',
  },
  'white-destructive': {
    filled: 'border-border bg-white text-destructive',
    stroke: 'border-white bg-transparent text-destructive',
  },
  'surface-destructive': {
    filled: 'border-destructive/30 bg-background text-destructive',
    stroke: 'border-destructive/50 bg-transparent text-destructive',
  },
  primary: {
    filled: 'border-transparent bg-primary/10 text-primary',
    stroke: 'border-primary/50 bg-transparent text-primary',
  },
};

const sizeClasses: Record<BadgeSize, string> = {
  xs: 'gap-1 px-1.5 py-0 text-[0.625rem] leading-4',
  sm: 'gap-1 px-2 py-0.5 text-xs leading-4',
  md: 'gap-1.5 px-2.5 py-0.5 text-sm leading-5',
  lg: 'gap-1.5 px-3 py-1 text-base leading-5',
};

const iconSizes: Record<BadgeSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
};

function isImageSource(value: string): boolean {
  return (
    /^(?:https?:|data:image\/|\/|\.\.?\/)/i.test(value) ||
    /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(value)
  );
}

function BadgeIcon({ icon, size }: { icon: ReactNode; size: number }) {
  const content =
    typeof icon === 'string' && isImageSource(icon) ? (
      <img src={icon} alt="" width={size} height={size} />
    ) : (
      resolveIcon(icon, size)
    );

  if (!content) {
    return null;
  }

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center [&>img]:size-full [&>svg]:size-full"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {content}
    </span>
  );
}

export function Badge({
  color,
  size = 'md',
  shape = 'rounded',
  icon,
  stroke = false,
  disabled = false,
  className,
  tone,
  children,
}: BadgeProps) {
  const resolvedColor = color || (tone === 'primary' ? 'primary' : 'gray');
  const palette = colorClasses[resolvedColor];

  return (
    <BadgePrimitive
      variant="secondary"
      className={cn(
        'h-auto justify-start overflow-visible whitespace-normal border align-middle transition-none',
        sizeClasses[size],
        stroke ? palette.stroke : palette.filled,
        shape === 'pill' ? 'rounded-full' : 'rounded-md',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? '' : undefined}
    >
      {icon ? <BadgeIcon icon={icon} size={iconSizes[size]} /> : null}
      {children}
    </BadgePrimitive>
  );
}
