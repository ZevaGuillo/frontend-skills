# Rule: Validator Adapter Pattern

> Use an adapter interface to make validation framework-agnostic. Zod is the default, but the architecture supports Yup, Joi, or custom validators.

## Why It Matters

- **Future-proof** — Swap validators without rewriting forms
- **Flexibility** — Different validators for different use cases
- **Testing** — Easy to mock validation
- **Migration** — Gradual migration between validators

---

## Adapter Interface

```typescript
// lib/validator-adapter.ts
import { z } from 'zod';

/**
 * Generic validator interface
 * Implement this for any validation library
 */
export interface Validator<T> {
  /** Parse and throw on invalid */
  parse: (data: unknown) => T;
  
  /** Parse and return result without throwing */
  safeParse: (data: unknown) => ValidatorResult<T>;
}

export interface ValidatorResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    issues?: ValidatorIssue[];
  };
}

export interface ValidatorIssue {
  path: (string | number)[];
  message: string;
}
```

---

## Zod Adapter (Default)

```typescript
// lib/validators/zod-adapter.ts
import { z, ZodSchema, ZodError } from 'zod';
import { Validator, ValidatorResult, ValidatorIssue } from '../validator-adapter';

/**
 * Creates a Zod-backed validator
 * Use as default validator for forms
 */
export function createZodValidator<T>(schema: ZodSchema<T>): Validator<T> {
  return {
    parse: (data: unknown): T => {
      return schema.parse(data);
    },
    
    safeParse: (data: unknown): ValidatorResult<T> => {
      const result = schema.safeParse(data);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      }
      
      return {
        success: false,
        error: {
          message: result.error.message,
          issues: result.error.issues.map(issue => ({
            path: issue.path,
            message: issue.message,
          })),
        },
      };
    },
  };
}
```

---

## Using Adapter in Forms

```typescript
// forms/products/product.schema.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  category: z.string().min(1),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

// forms/products/use-product-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createZodValidator } from '@/lib/validators/zod-adapter';
import { createProductSchema, CreateProductFormData } from './product.schema';

// Create adapter instance (for custom validation if needed)
const productValidator = createZodValidator(createProductSchema);

export function useCreateProductForm() {
  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema), // RHF needs resolver
    defaultValues: {
      name: '',
      price: 0,
      category: '',
    },
  });
  
  // Use adapter for custom validation
  const validateBeforeSubmit = (data: CreateProductFormData) => {
    const result = productValidator.safeParse(data);
    if (!result.success) {
      // Handle validation errors
      return { success: false, errors: result.error };
    }
    return { success: true };
  };
  
  return { form, validateBeforeSubmit };
}
```

---

## Future: Yup Adapter (Example)

```typescript
// lib/validators/yup-adapter.ts
import * as Yup from 'yup';
import { Validator, ValidatorResult } from '../validator-adapter';

export function createYupValidator<T>(schema: Yup.ObjectSchema<T>): Validator<T> {
  return {
    parse: async (data: unknown): Promise<T> => {
      return await schema.validate(data);
    },
    
    safeParse: async (data: unknown): Promise<ValidatorResult<T>> => {
      try {
        const validated = await schema.validate(data, { abortEarly: false });
        return { success: true, data: validated };
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          return {
            success: false,
            error: {
              message: error.message,
              issues: error.inner.map(err => ({
                path: err.path ? err.path.split('.') : [],
                message: err.message,
              })),
            },
          };
        }
        return { success: false, error: { message: 'Unknown error' } };
      }
    },
  };
}
```

---

## Validator Registry (Optional)

```typescript
// lib/validators/registry.ts
import { Validator } from './validator-adapter';

type ValidatorType = 'zod' | 'yup' | 'joi' | 'custom';

interface ValidatorRegistry {
  get: <T>(type: ValidatorType, schema: unknown) => Validator<T>;
  register: (type: ValidatorType, factory: (schema: unknown) => Validator<unknown>) => void;
}

const registry: Record<ValidatorType, (schema: unknown) => Validator<unknown>> = {
  zod: (schema) => createZodValidator(schema),
  // yup: (schema) => createYupValidator(schema),
  // joi: (schema) => createJoiValidator(schema),
  custom: (schema) => schema as Validator<unknown>,
};

export const validatorRegistry: ValidatorRegistry = {
  get: (type, schema) => registry[type](schema) as Validator<unknown>,
  register: (type, factory) => {
    registry[type] = factory;
  },
};
```

---

## When to Use Adapter Directly

| Scenario | Use Adapter | Use Resolver Directly |
|----------|-------------|----------------------|
| Custom validation logic | ✅ | ❌ |
| Server-side validation | ✅ | ❌ |
| Testing without React | ✅ | ❌ |
| Standard form with RHF | ❌ | ✅ (zodResolver) |

---

## Best Practices

1. **Default to zodResolver** — For standard React Hook Form usage
2. **Use adapter for custom logic** — When RHF resolver isn't enough
3. **Keep adapter simple** — Just wrap the validator
4. **Type inference** — Always infer types from schema

---

## References

- SKILL.md: Forms overview
- `rules/zod-schema-isolation.md`: Schema isolation
- `templates/form.schema.ts`: Schema with adapter
