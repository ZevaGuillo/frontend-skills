---
name: forms
description: Implements forms using React Hook Form with Zod validation. Use this skill when building any form, adding field validation, or connecting a form to a mutation hook.
license: MIT
---

# Skill: forms

> React Hook Form with Zod validation, validator-agnostic architecture, and shadcn/ui integration.

## When to Apply

Activate this skill when:

- Building any form (login, registration, CRUD)
- Adding field validation
- Creating form schemas
- Connecting forms to mutation hooks
- Implementing conditional fields
- Handling form errors

## Quick Reference

- `[PATTERN]` Zod schema isolated in separate `*.schema.ts` file
- `[PATTERN]` Validator adapter for future extensibility (Yup, Joi, etc.)
- `[MUST]` Use shadcn/ui Form components as base
- `[MUST]` Validation on blur, not on initial render
- `[PREFERRED]` Conditional fields based on other field values
- `[PREFERRED]` Dependent validation between related fields
- `[MUST]` Connect forms to useMutation from api-fetching

## Rules

| Priority | Rule | Impact | Reference File |
|----------|------|--------|-----------------|
| 1 | Zod schema isolation | High | `rules/zod-schema-isolation.md` |
| 2 | Validator adapter pattern | High | `rules/validator-adapter.md` |
| 3 | useForm configuration | High | `rules/form-hook-usage.md` |
| 4 | shadcn/ui integration | High | `rules/shadcn-form-integration.md` |
| 5 | Conditional fields | Medium | `rules/conditional-fields.md` |
| 6 | Dependent validation | Medium | `rules/dependent-validation.md` |
| 7 | Field-level validation | Medium | `rules/field-level-validation.md` |
| 8 | Form + mutation integration | High | `rules/form-mutation-integration.md` |

## Detail by Category

### Zod Schema Isolation

Always keep Zod schema in a separate file:

```typescript
// forms/products/product.schema.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  category: z.string().min(1),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
```

### Validator Adapter

Use adapter pattern to support future validators:

```typescript
// lib/validator-adapter.ts
export type Validator<T> = {
  parse: (data: unknown) => T;
  safeParse: (data: unknown) => { success: boolean; data?: T; error?: z.ZodError };
};

export function createZodAdapter<T>(schema: z.ZodSchema<T>): Validator<T> {
  return {
    parse: (data) => schema.parse(data),
    safeParse: (data) => schema.safeParse(data),
  };
}
```

### Field-Level Validation

Validate on blur, not on initial render:

```typescript
const form = useForm({
  mode: 'onBlur', // Validate when field loses focus
  shouldFocusError: true,
});
```

### Conditional Fields

Show/hide fields based on other values:

```typescript
const paymentMethod = form.watch('paymentMethod');

// Only show card fields if credit_card selected
{paymentMethod === 'credit_card' && (
  <FormField name="cardNumber" render={({ field }) => <Input {...field} />} />
)}
```

---

## Templates

- `templates/form.schema.ts` — Zod schema + adapter + types
- `templates/use-form.template.ts` — useForm hook with validation
- `templates/form-fields.template.tsx` — Field components (simple + conditional)
- `templates/form-mutation.template.ts` — Full form with mutation

## Field Types

### Common Fields

- Text, Email, Password, Number
- Textarea
- Select/Dropdown
- Checkbox
- Radio Group

### Complex Fields

- **Conditional fields**: Show/hide based on other values
- **Dependent validation**: Confirm password must match password
- **Date fields**: With range validation

## Anti-Patterns

- ❌ Inline Zod schema in component file
- ❌ Validation on initial render
- ❌ Not connecting form to mutation
- ❌ Hardcoding field validation in component
- ❌ Using uncontrolled inputs with RHF
