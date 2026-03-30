// Shared Types — LOAD: when sharing types between layers
// ~20 lines → ~400 bytes

export const SHARED_TYPES_TEMPLATE = (entity => `
// domain/types/\${entity}.types.ts
export interface \${Entity} {
  id: string;
  name: string;
  createdAt: string;
}

export interface Create\${Entity}Dto {
  name: string;
  // ... fields
}

export interface Update\${Entity}Dto extends Partial<Create\${Entity}Dto> {}

export interface \${Entity}Filters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Import in all layers:
// api: import { \${Entity}, Create\${Entity}Dto } from '@/features/\${entity}s/domain/types'
// repository: same
// hook: same
`);
