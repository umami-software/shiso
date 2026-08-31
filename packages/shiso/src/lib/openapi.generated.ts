// Build-time alias target. Shiso replaces this module with the project's generated operations.
import type { NormalizedOperation } from '@/lib/types';

export const OPENAPI_OPERATIONS: Record<string, NormalizedOperation> = {};
