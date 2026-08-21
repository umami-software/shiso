import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Button as ButtonPrimitive, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { resolveIcon } from './utils';

export interface ButtonProps {
  href?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  size?: 'default' | 'xs' | 'sm' | 'lg';
  icon?: ReactNode | string;
  className?: string;
  children?: ReactNode;
}

/**
 * MDX-facing button. Renders a link when `href` is set (internal routes go
 * through react-router), otherwise a plain button element.
 */
export function Button({
  href,
  variant = 'default',
  size = 'default',
  icon,
  className,
  children,
}: ButtonProps) {
  const resolvedIcon = resolveIcon(icon, 16);
  const content = (
    <>
      {resolvedIcon}
      {children}
    </>
  );
  // MDX wraps block-level children in <p>; strip its margins so the label
  // stays centered against the icon.
  const baseClassName = cn(resolvedIcon ? 'gap-2' : '', '[&_p]:m-0', className);

  if (!href) {
    return (
      <ButtonPrimitive variant={variant} size={size} className={baseClassName}>
        {content}
      </ButtonPrimitive>
    );
  }

  const linkClassName = cn(
    buttonVariants({ variant, size }),
    'no-underline hover:no-underline active:no-underline',
    baseClassName,
  );
  const external = /^https?:\/\//i.test(href);

  if (external) {
    return (
      <a href={href} className={linkClassName} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={linkClassName}>
      {content}
    </Link>
  );
}
