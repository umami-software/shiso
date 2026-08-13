// Build-time alias target. Shiso replaces this module with the project's generated registry.
import type { IconComponent } from '@/lib/icons';

export const ICON_REGISTRY: Record<string, IconComponent> = {};
