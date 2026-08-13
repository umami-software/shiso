import type { ComponentType, SVGProps } from 'react';
import { ICON_REGISTRY } from '@/lib/icon-registry.generated';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

/** `circle-check`, `circle_check`, `CircleCheck` all resolve to the same icon. */
export function normalizeIconName(name: string): string {
  return name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Looks up an author-supplied icon name. The registry is generated at build time from
 * the names found in content, so an icon only resolves after it appears in a source file.
 */
export function getIcon(name: string): IconComponent | undefined {
  const icon = ICON_REGISTRY[normalizeIconName(name)];

  if (!icon && import.meta.env?.DEV) {
    console.warn(`Unknown icon "${name}". Check the name against the lucide icon set.`);
  }

  return icon;
}
