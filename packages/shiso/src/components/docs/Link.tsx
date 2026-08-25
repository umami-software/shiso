import type { ComponentProps } from 'react';
import { Link as RouterLink } from 'react-router';

export type LinkProps = ComponentProps<typeof RouterLink>;

/**
 * Client-side navigation link bound to Shiso's router. Exposed from
 * `@umami/shiso/components` so TSX standalone pages and other app code can
 * navigate without reloading (importing `react-router` directly would create a
 * second router instance without Shiso's context).
 */
export function Link(props: LinkProps) {
  return <RouterLink {...props} />;
}
