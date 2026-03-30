# Rule: Field-Level Validation

> Validate fields individually on blur, not on initial render. Show errors only after user interacts with the field.

## Why It Matters

- **UX** — Don't show errors before user has a chance to fill the field
- **Less frustration** — Users aren't bombarded with errors immediately
- **Clarity** — User knows exactly which field has the issue
- **Performance** — Validate only what's needed

---

## The Problem: Validation on Initial Render

```tsx
// ❌ DON'T: Validate immediately on mount
const form = useForm({
  mode: 'onChange', // Validates on every change!
  // OR
  mode: 'all', // Validates on change AND blur
});

/* Problem: 
 * - User opens form
 * - Sees all fields marked as invalid
 * - Gets frustrated
 * - Doesn't know where to start
 */
```

---

## The Solution: onBlur Validation

```tsx
// ✅ DO: Validate when user leaves the field
const form = useForm({
  mode: 'onBlur',        // Validate when field loses focus
  reValidateMode: 'onChange', // After first submit, validate on change
});
```

**Flow:**
1. User opens form → No errors shown ✓
2. User types in field → No errors ✓
3. User leaves field (blur) → Field validates ✓
4. If error → Show error message for that field
5. User fixes → Error clears on next blur ✓

---

## Implementation

```tsx
// forms/products/ProductForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, CreateProductFormData } from './product.schema';

export function ProductForm() {
  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    mode: 'onBlur',              // Key: validate on blur
    reValidateMode: 'onChange', // After submit attempt, validate on change
    defaultValues: {
      name: '',
      price: 0,
      category: '',
    },
  });

  const { errors, touchedFields, isSubmitting } = form.formState;

  // Helper to show error only if touched
  const showError = (field: keyof CreateProductFormData) => {
    return touchedFields[field] && errors[field];
  };

  return (
    <Form {...form}>
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            {/* Show error only if touched */}
            {showError('name') && (
              <FormMessage>{errors.name?.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </Form>
  );
}
```

---

## Field-Level Rules in Schema

```typescript
// Validation rules in Zod schema
export const createProductSchema = z.object({
  // String validations
  name: z
    .string()
    .min(1, 'Name is required')           // Min length
    .max(100, 'Name is too long')        // Max length
    .trim(),                               // Trim whitespace

  // Email validation
  email: z
    .string()
    .email('Invalid email address'),

  // Number validations
  price: z
    .number({ invalid_type_error: 'Price is required' })
    .positive('Price must be positive')
    .min(0.01, 'Minimum price is $0.01')
    .max(999999.99, 'Maximum price is $999,999.99'),

  // Custom validation
  sku: z
    .string()
    .regex(/^[A-Z]{3}-\d{4}$/, 'SKU must be format: ABC-1234'),

  // Conditional required
  description: z
    .string()
    .max(500)
    .optional()
    .or(z.literal('')),

  // Enum
  status: z.enum(['draft', 'published', 'archived']),
});
```

---

## Conditional Error Display

```tsx
// Show error only when field was touched AND has error
const hasError = (field: string) => {
  return form.formState.touchedFields[field as keyof typeof form.formState.touchedFields] 
    && form.formState.errors[field as keyof typeof form.formState.errors];
};

// In component
<FormField
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Input {...field} />
      </FormControl>
      {hasError('email') && (
        <FormMessage />
      )}
    </FormItem>
  )}
/>
```

---

## submitCount for First Submit

```tsx
// Alternative: Show errors after first submit attempt
const form = useForm({
  mode: 'onBlur',
});

const { submitCount, isSubmitting } = form.formState;

// Show error if: (first submit was attempted) AND (has error)
const showError = (field: string) => {
  return submitCount > 0 && form.formState.errors[field as keyof typeof form.formState.errors];
};
```

---

## Error Display Component

```tsx
// Reusable error display
function FieldError({ name }: { name: string }) {
  const { formState } = useFormContext();
  const error = formState.errors[name];
  const touched = formState.touchedFields[name];
  
  // Show: touched AND has error
  if (touched && error) {
    return <FormMessage className="text-destructive" />;
  }
  
  return null;
}

// Usage
<FormField
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FieldError name="email" />
    </FormItem>
  )}
/>
```

---

## First Interaction vs submitCount

| Approach | First Render | User Types | User Blurs | User Submits |
|----------|-------------|------------|------------|--------------|
| touched | No error | No error | Shows if error | Shows if error |
| submitCount | No error | No error | No error | Shows all |
| onChange | No error | Shows immediately | Shows | Shows |

**Recommendation:**
- `mode: 'onBlur'` + touched fields = Best UX
- `reValidateMode: 'onChange'` = After first submit, be more responsive

---

## Best Practices

1. **Use onBlur mode** — Validate when user leaves field
2. **Check touched** — Only show error if user interacted with field
3. **reValidateMode: onChange** — After submit, be more responsive
4. **Clear messages** — Zod error messages should be user-friendly
5. **Type conversion** — Handle string → number for inputs

---

## References

- SKILL.md: Forms overview
- `rules/form-hook-usage.md`: useForm configuration
- `rules/shadcn-form-integration.md`: UI integration
