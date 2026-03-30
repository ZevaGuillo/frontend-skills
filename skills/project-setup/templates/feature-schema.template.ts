/**
 * Zod Schema Template
 * 
 * Replace all placeholders:
 * - [Entity] → Product, User, Order, etc. (PascalCase singular)
 * - [entity] → product, user, order, etc. (camelCase singular)
 * 
 * This file defines Zod schemas for validation.
 * These schemas are implementation details - NOT exported from feature index.ts
 */

import { z } from 'zod';

// =============================================================================
// Core Entity Schema
// =============================================================================

/**
 * Schema for [Entity] entity
 * Validates the complete entity structure
 */
export const [entity]Schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Type inferred from schema
 */
export type [Entity]SchemaType = z.infer<typeof [entity]Schema>;

// =============================================================================
// Create Schema
// =============================================================================

/**
 * Schema for creating a new [Entity]
 * Validates form data before submission
 */
export const create[Entity]Schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
});

/**
 * Type inferred from create schema
 */
export type Create[Entity]SchemaType = z.infer<typeof create[Entity]Schema>;

// =============================================================================
// Update Schema
// =============================================================================

/**
 * Schema for updating an existing [Entity]
 * All fields are optional - only provided fields are validated
 */
export const update[Entity]Schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  isActive: z.boolean().optional(),
});

/**
 * Type inferred from update schema
 */
export type Update[Entity]SchemaType = z.infer<typeof update[Entity]Schema>;

// =============================================================================
// Filter Schema
// =============================================================================

/**
 * Schema for [Entity] filters
 * Validates query parameters
 */
export const [entity]FiltersSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z
    .string()
    .or(z.number())
    .transform(Number)
    .pipe(z.number().int().positive().default(1))
    .optional(),
  limit: z
    .string()
    .or(z.number())
    .transform(Number)
    .pipe(z.number().int().positive().max(100).default(20))
    .optional(),
  sortBy: z
    .enum(['name', 'createdAt', 'updatedAt'])
    .optional(),
  sortOrder: z
    .enum(['asc', 'desc'])
    .default('asc'),
});

/**
 * Type inferred from filters schema
 */
export type [Entity]FiltersSchemaType = z.infer<typeof [entity]FiltersSchema>;

// =============================================================================
// ID Parameter Schema
// =============================================================================

/**
 * Schema for validating entity ID in route parameters
 */
export const [entity]IdSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

/**
 * Type inferred from ID schema
 */
export type [Entity]IdSchemaType = z.infer<typeof [entity]IdSchema>;

// =============================================================================
// Bulk Delete Schema
// =============================================================================

/**
 * Schema for bulk delete operations
 */
export const bulkDelete[Entity]Schema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'At least one ID is required'),
});

/**
 * Type inferred from bulk delete schema
 */
export type BulkDelete[Entity]SchemaType = z.infer<typeof bulkDelete[Entity]Schema>;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Validates data against create schema
 * Returns the validated data or throws if invalid
 */
export function validateCreate[Entity](data: unknown): Create[Entity]SchemaType {
  return create[Entity]Schema.parse(data);
}

/**
 * Validates data against update schema
 * Returns the validated data or throws if invalid
 */
export function validateUpdate[Entity](data: unknown): Update[Entity]SchemaType {
  return update[Entity]Schema.parse(data);
}

/**
 * Validates filters against filter schema
 * Returns the validated filters or throws if invalid
 */
export function validate[Entity]Filters(data: unknown): [Entity]FiltersSchemaType {
  return [entity]FiltersSchema.parse(data);
}

/**
 * Safe validation versions that return result instead of throwing
 */
export function safeValidateCreate[Entity](data: unknown) {
  return create[Entity]Schema.safeParse(data);
}

export function safeValidateUpdate[Entity](data: unknown) {
  return update[Entity]Schema.safeParse(data);
}

export function safeValidate[Entity]Filters(data: unknown) {
  return [entity]FiltersSchema.safeParse(data);
}
