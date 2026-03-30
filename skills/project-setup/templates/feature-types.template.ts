/**
 * Domain Types Template
 * 
 * Replace all placeholders:
 * - [Entity] → Product, User, Order, etc. (PascalCase singular)
 * - [entity] → product, user, order, etc. (camelCase singular)
 * 
 * This file defines the core types for the feature domain layer.
 * These types have ZERO dependencies on other project code.
 */

// =============================================================================
// Core Entity
// =============================================================================

/**
 * Core [Entity] entity
 * Represents the primary data model for this feature
 */
export interface [Entity] {
  id: string;
  // Add entity fields here
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Data Transfer Objects (DTOs)
// =============================================================================

/**
 * DTO for creating a new [Entity]
 * Used in POST requests and form submissions
 */
export interface Create[Entity]Dto {
  // Add required create fields here
  name: string;
  description?: string;
  // Add more fields as needed
}

/**
 * DTO for updating an existing [Entity]
 * All fields are optional - only provided fields will be updated
 */
export interface Update[Entity]Dto extends Partial<Create[Entity]Dto> {
  isActive?: boolean;
}

// =============================================================================
// Filter Types
// =============================================================================

/**
 * Filters for querying [Entities]
 * Used in list endpoints with query parameters
 */
export interface [Entity]Filters {
  // Add filter fields here
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: keyof [Entity];
  sortOrder?: 'asc' | 'desc';
  // Add more filters as needed
}

// =============================================================================
// Response Types
// =============================================================================

/**
 * Paginated response for list queries
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Response for a single [Entity] query
 */
export interface [Entity]Response {
  data: [Entity];
}

/**
 * Response for list query
 */
export interface [Entity]ListResponse extends PaginatedResponse<[Entity]> {}

// =============================================================================
// Query Key Types (for TanStack Query)
// =============================================================================

import { QueryKey } from '@tanstack/react-query';

/**
 * Query keys for [Entity] feature
 * Centralized constants to avoid magic strings
 */
export const [ENTITY]_QUERY_KEYS = {
  all: ['[entity]'] as const,
  lists: () => [...[ENTITY]_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: [Entity]Filters) => [...[ENTITY]_QUERY_KEYS.lists(), filters] as const,
  details: () => [...[ENTITY]_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...[ENTITY]_QUERY_KEYS.details(), id] as const,
} as const;

export type [Entity]QueryKey = ReturnType<typeof [ENTITY]_QUERY_KEYS.detail>;
export type [Entity]ListQueryKey = ReturnType<typeof [ENTITY]_QUERY_KEYS.list>;

// =============================================================================
// Form Types (for React Hook Form)
// =============================================================================

/**
 * Form data type matching Create[Entity]Dto
 * Used in React Hook Form
 */
export type [Entity]FormData = Create[Entity]Dto;

/**
 * Form values for editing existing [Entity]
 * Extends create DTO with ID
 */
export interface [Entity]FormValues extends [Entity]FormData {
  id: string;
}

// =============================================================================
// Action Result Types
// =============================================================================

/**
 * Result of a successful create operation
 */
export interface Create[Entity]Result {
  data: [Entity];
  message: string;
}

/**
 * Result of a successful update operation
 */
export interface Update[Entity]Result {
  data: [Entity];
  message: string;
}

/**
 * Result of a successful delete operation
 */
export interface Delete[Entity]Result {
  id: string;
  message: string;
}
