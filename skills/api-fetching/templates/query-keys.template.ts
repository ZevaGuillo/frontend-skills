/**
 * Query Keys Template
 * 
 * Replace placeholders:
 * - [Entity] → Product, User, Order (PascalCase)
 * - [entity] → product, user, order (camelCase)
 * - [entities] → products, users, orders (plural)
 * 
 * Query keys must be:
 * - Typed constants (not magic strings)
 * - Exported from a single file
 * - Used consistently across all hooks
 */

import { QueryKey } from '@tanstack/react-query';

// =============================================================================
// Helper — Create typed query key
// =============================================================================

/**
 * Creates a typed query key from arguments
 */
function createQueryKey<T extends unknown[]>(...keys: T): QueryKey {
  return keys;
}

// =============================================================================
// [Entity] Query Keys
// =============================================================================

export const QUERY_KEYS = {
  [entity]: {
    /** Invalidate all [entity] queries */
    all: createQueryKey('[entities]'),
    
    /** Invalidate all [entity] list queries */
    lists: () => createQueryKey('[entities]', 'list'),
    
    /** Query key for filtered [entity] list */
    list: (filters?: [Entity]Filters) => 
      createQueryKey('[entities]', 'list', filters),
    
    /** Invalidate all [entity] detail queries */
    details: () => createQueryKey('[entities]', 'detail'),
    
    /** Query key for single [entity] */
    detail: (id: string) => 
      createQueryKey('[entities]', 'detail', id),
  },
  
  // Add more entities as needed
  // orders: { ... },
  // users: { ... },
  
} as const;

// =============================================================================
// Type Helpers
// =============================================================================

/** Type for single [entity] query key */
export type [Entity]QueryKey = ReturnType<typeof QUERY_KEYS.[entity].detail>;

/** Type for [entity] list query key */
export type [Entity]ListQueryKey = ReturnType<typeof QUERY_KEYS.[entity].list>;

/** Type for all [entity] query keys */
export type [Entity]AllQueryKey = typeof QUERY_KEYS.[entity].all;

// =============================================================================
// Filter Types (if not in types file)
// =============================================================================

export interface [Entity]Filters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // Add more filters as needed
}

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * Example: Using query keys in hooks
 * 
 * ```typescript
 * import { useQuery } from '@tanstack/react-query';
 * import { QUERY_KEYS } from './query-keys';
 * 
 * // List query
 * useQuery({
 *   queryKey: QUERY_KEYS.[entity].list({ page: 1 }),
 *   queryFn: () => fetch[Entities]({ page: 1 }),
 * });
 * 
 * // Detail query
 * useQuery({
 *   queryKey: QUERY_KEYS.[entity].detail('123'),
 *   queryFn: () => fetch[Entity]('123'),
 * });
 * ```
 */

/**
 * Example: Invalidation
 * 
 * ```typescript
 * import { QUERY_KEYS } from './query-keys';
 * 
 * // Invalidate all [entity] queries
 * queryClient.invalidateQueries({
 *   queryKey: QUERY_KEYS.[entity].all,
 * });
 * 
 * // Invalidate only lists
 * queryClient.invalidateQueries({
 *   queryKey: QUERY_KEYS.[entity].lists(),
 * });
 * 
 * // Invalidate specific filtered list
 * queryClient.invalidateQueries({
 *   queryKey: QUERY_KEYS.[entity].list({ active: true }),
 * });
 * ```
 */
