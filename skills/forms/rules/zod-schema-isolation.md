# Rule: Zod Schema Isolation

> Always keep Zod schema in a separate file. Never inline schema in component files. This enables validator swapping and cleaner components.

## Why It Matters

- **Separation of concerns** — Validation logic separate from UI
- **Testability** — Test schema without rendering components
- **Reusability** — Use schema in API validation, too
- **Maintainability** — Schema changes don't affect components
- **Validator swapping** — Easy to switch to Yup/Joi

---

## Correct: Separate Schema File

```typescript
// forms/products/product.schema.ts
import { z } from 'zod';

// Schema definition
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
});

// Inferred TypeScript type
export type CreateProductFormData = z.infer<typeof createProductSchema>;

// Schema for updates (partial)
export const updateProductSchema = createProductSchema.partial();
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
```

---

## Incorrect: Inline Schema

```typescript
// ❌ DON'T: Inline schema in component
// forms/products/ProductForm.tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

function ProductForm() {
  // Schema inline - BAD!
  const schema = z.object({
    name: z.string().min(1),
    price: z.number().positive(),
  });
  
  const form = useForm({
    resolver: zodResolver(schema),
  });
  
  // ...
}
```

**Problems:**
- Can't test schema independently
- Duplication if used in API
- Hard to maintain
- Pollutes component file

---

## Schema File Structure

```typescript
// forms/[entity]/schema.ts

import { z } from 'zod';

// =============================================================================
// Create Schema
// =============================================================================

export const create[Entity]Schema = z.object({
  // Required fields
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  
  // Optional fields
  description: z.string().max(500).optional(),
  
  // Enums
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  
  // Numbers
  quantity: z.number().int().positive().min(1).max(100),
  
  // Booleans
  isPublic: z.boolean().default(false),
  
  // Dates
  expiresAt: z.string().datetime().optional(),
});

// =============================================================================
// Update Schema (partial of create)
// =============================================================================

export const update[Entity]Schema = create[Entity]Schema.partial();

// =============================================================================
// Filter Schema (for search/filter forms)
// =============================================================================

export const [entity]FiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// =============================================================================
// Type Exports
// =============================================================================

export type Create[Entity]FormData = z.infer<typeof create[Entity]Schema>;
export type Update[Entity]FormData = z.infer<typeof update[Entity]Schema>;
export type [Entity]Filters = z.infer<typeof [entity]FiltersSchema>;
```

---

## Schema in Multiple Files

For complex forms, split by concern:

```typescript
// forms/user/schema/base.ts — Core fields
export const userBaseSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

// forms/user/schema/profile.ts — Profile extension
export const userProfileSchema = userBaseSchema.extend({
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
});

// forms/user/schema/security.ts — Security fields
export const userSecuritySchema = z.object({
  password: z.string().min(8).max(100),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Combine for full form
export const createUserSchema = z.object({
  ...userBaseSchema.shape,
  ...userProfileSchema.shape,
  ...userSecuritySchema.shape,
});
```

---

## Best Practices

1. **One schema file per feature** — `forms/products/schema.ts`
2. **Export inferred types** — `CreateProductFormData`
3. **Use discriminated unions** — For conditional validation
4. **Custom error messages** — Always provide user-friendly messages
5. **Schema versioning** — `v1: createProductSchemaV1`

---

## References

- SKILL.md: Forms overview
- `rules/validator-adapter.md`: Adapter pattern
- `templates/form.schema.ts`: Template
