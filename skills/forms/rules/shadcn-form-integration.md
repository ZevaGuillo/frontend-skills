# Rule: shadcn/ui Form Integration

> Use shadcn/ui Form components as the base layer while keeping Zod schema isolated. Combine shadcn UI with the validator adapter.

## Why It Matters

- **Accessibility** — shadcn forms are accessible
- **Consistency** — Same form patterns across codebase
- **Clean code** — UI separate from validation
- **DX** — Good TypeScript support

---

## shadcn Form Components

```tsx
// shadcn Form hierarchy
<Form>
  <FormField
    name="fieldName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormDescription>Helper text</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

---

## Component Hierarchy

```
Form (wrapper)
├── FormField (connects RHF to UI)
│   ├── FormItem
│   │   ├── FormLabel
│   │   ├── FormControl (wraps input)
│   │   ├── FormDescription
│   │   └── FormMessage
```

---

## Full Example

```tsx
// forms/products/ProductForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createProductSchema, CreateProductFormData } from './product.schema';

export function ProductForm() {
  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      price: 0,
      category: '',
      description: '',
      isActive: true,
    },
    mode: 'onBlur',
  });

  function onSubmit(data: CreateProductFormData) {
    console.log('Submitted:', data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Text Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormDescription>
                The name will be displayed in the catalog.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number Field */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Checkbox Field */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active product</FormLabel>
                <FormDescription>
                  Inactive products won't show in the catalog.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit">Create Product</Button>
      </form>
    </Form>
  );
}
```

---

## Custom Input Types

### Textarea

```tsx
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea
          placeholder="Product description"
          className="resize-none"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Checkbox

```tsx
<FormField
  control={form.control}
  name="terms"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <FormLabel className="font-normal">
        I agree to the terms and conditions
      </FormLabel>
    </FormItem>
  )}
/>
```

### Radio Group

```tsx
<FormField
  control={form.control}
  name="priority"
  render={({ field }) => (
    <FormItem className="space-y-3">
      <FormLabel>Priority</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          className="flex flex-col space-y-1"
        >
          <FormItem className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem value="low" />
            </FormControl>
            <FormLabel className="font-normal">Low</FormLabel>
          </FormItem>
          <FormItem className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem value="medium" />
            </FormControl>
            <FormLabel className="font-normal">Medium</FormLabel>
          </FormItem>
          <FormItem className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem value="high" />
            </FormControl>
            <FormLabel className="font-normal">High</FormLabel>
          </FormItem>
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## shadcn + Schema Integration

```typescript
// forms/products/product.schema.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  price: z.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
```

---

## Best Practices

1. **Use shadcn Form components** — They're accessible and consistent
2. **Keep schema separate** — In `*.schema.ts` file
3. **Use resolver** — `zodResolver` for RHF integration
4. **Handle number inputs** — Convert string to number in onChange
5. **Provide FormDescription** — Help users understand fields

---

## References

- SKILL.md: Forms overview
- `rules/zod-schema-isolation.md`: Schema isolation
- `rules/form-hook-usage.md`: useForm config
- `templates/form-fields.template.tsx`: Field templates
