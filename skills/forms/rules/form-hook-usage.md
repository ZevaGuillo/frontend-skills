# Rule: useForm Configuration

> Configure useForm with proper settings for validation timing, error display, and user experience.

## Why It Matters

- **User experience** — Validation at right time prevents frustration
- **Performance** — Avoid unnecessary re-renders
- **Accessibility** — Focus management for errors
- **DX** — Better autocomplete and types

---

## Basic Configuration

```typescript
// forms/products/use-product-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, CreateProductFormData } from './product.schema';

export function useCreateProductForm() {
  const form = useForm<CreateProductFormData>({
    // Resolver for Zod validation
    resolver: zodResolver(createProductSchema),
    
    // Default values
    defaultValues: {
      name: '',
      price: 0,
      category: '',
      description: '',
      isActive: true,
    },
    
    // Validation mode
    mode: 'onBlur', // Validate when field loses focus
    
    // When to re-render (performance)
    reValidateMode: 'onChange', // Revalidate on change after first submit
    
    // Should unregister on unmount
    shouldUnregister: true,
    
    // Focus first error on submit
    shouldFocusError: true,
  });
  
  return form;
}
```

---

## Validation Modes

### onBlur (Recommended)

```typescript
// ✅ RECOMMENDED: Validate when user leaves field
const form = useForm({
  mode: 'onBlur',
  reValidateMode: 'onChange',
});
```

**Behavior:**
- First render: No errors shown
- User types in field: No errors
- User leaves field (blur): Validates that field
- User submits: Validates all fields

**Pros:**
- Less annoying than onChange
- Errors show after user finishes typing
- Good UX

### onChange

```typescript
// ⚠️ USE SPARINGLY: Validates on every change
const form = useForm({
  mode: 'onChange',
});
```

**Behavior:**
- First render: No errors shown
- User types: Validates on every keystroke
- Can be annoying if errors show immediately

**Use for:**
- Real-time validation (password strength)
- Critical fields that must be valid immediately

### onSubmit (Default)

```typescript
// Default: Only validate on submit
const form = useForm({
  mode: 'onSubmit',
});
```

**Behavior:**
- User fills form: No errors
- User submits: Validates all fields
- If errors: Show all, don't submit
- If valid: Submit

---

## Mode Comparison

| Mode | First Render | User Types | User Blurs | User Submits |
|------|-------------|------------|------------|--------------|
| onBlur | No errors | No errors | Validates field | Validates all |
| onChange | No errors | Validates | Validates | Validates |
| onSubmit | No errors | No errors | No errors | Validates all |

---

## Form State

```typescript
function ProductForm() {
  const form = useForm({ /* config */ });
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty, touchedFields },
    reset,
    setValue,
    watch,
    getValues,
  } = form;
  
  // errors - Object with field errors
  // isSubmitting - True during submission
  // isValid - True if form passes validation
  // isDirty - True if user changed any field
  // touchedFields - Object tracking touched fields
}
```

---

## Watch Values

```typescript
function ProductForm() {
  const form = useForm({ /* config */ });
  
  // Watch single field
  const category = watch('category');
  
  // Watch multiple fields
  const [name, price] = watch(['name', 'price']);
  
  // Watch all fields
  const allValues = watch();
  
  // Use for conditional rendering
  return (
    <div>
      {category === 'electronics' && (
        <Field name="warranty" />
      )}
    </div>
  );
}
```

---

## setValue & setValues

```typescript
function ProductForm() {
  const form = useForm({ /* config */ });
  
  // Set single field value
  setValue('price', 100, { shouldValidate: true });
  
  // Set multiple fields
  setValues({
    name: 'Product',
    price: 100,
    category: 'electronics',
  });
  
  // shouldDirty: marks field as dirty
  // shouldTouch: marks field as touched
  // shouldValidate: triggers validation
}
```

---

## reset Form

```typescript
function ProductForm() {
  const form = useForm({ /* config */ });
  
  // Reset to default values
  const handleClear = () => {
    reset();
  };
  
  // Reset to specific values (e.g., for edit)
  const handleEdit = (product: Product) => {
    reset(product);
  };
  
  // Reset with new defaults
  const handleNewDefaults = () => {
    reset({
      name: '',
      price: 0,
      category: '',
    });
  };
}
```

---

## Error Handling in Component

```tsx
function ProductForm() {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });
  
  const { errors, touchedFields } = form.formState;
  
  // Only show error if field was touched AND has error
  const showError = (field: string) => {
    return touchedFields[field] && errors[field];
  };
  
  return (
    <form>
      <div>
        <input {...register('name')} />
        {showError('name') && (
          <p className="text-destructive">{errors.name?.message}</p>
        )}
      </div>
    </form>
  );
}
```

---

## Best Practices

1. **Use onBlur mode** — Best UX for most forms
2. **Use reValidateMode: onChange** — After first submit, validate on change
3. **shouldFocusError: true** — Helps accessibility
4. **shouldUnregister: true** — Clean up on unmount (for conditionally rendered fields)
5. **Default values** — Always provide defaultValues

---

## References

- SKILL.md: Forms overview
- `rules/field-level-validation.md`: Validation timing
- `templates/use-form.template.ts`: Full template
