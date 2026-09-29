// Build-time alias target. Shiso replaces this module with the project's generated operations.
import type { NormalizedOperation, SchemaPage } from '@/lib/types';

export const OPENAPI_OPERATIONS: Record<string, NormalizedOperation> = {};
export const OPENAPI_SCHEMAS: Record<string, SchemaPage> = {};
