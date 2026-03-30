# Rule: Form + Mutation Integration

> Connect React Hook Form to useMutation from api-fetching skill. Handle loading, errors, and success states.

## Why It Matters

- **Seamless UX** — Form submits via mutation
- **Error handling** — Server errors show in form
- **Loading states** — Disable form during submission
- **Optimistic updates** — Works with TanStack Query

---

## Basic Integration

```tsx
// forms/products/use-create-product-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProduct } from '@/features/products/hooks/use-create-product';
import { createProductSchema, CreateProductFormData } from './product.schema';

export function useCreateProductForm() {
  const mutation = useCreateProduct();
  
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

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync(data);
      form.reset(); // Clear form on success
    } catch (error) {
      // Handle server errors
      if (error.response?.status === 409) {
        form.setError('name', { 
          message: 'Product name already exists' 
        });
      }
    }
  });

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
```

---

## Full Component

```tsx
// forms/products/ProductForm.tsx
'use client';

import { useCreateProductForm } from './use-create-product-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ProductForm() {
  const { form, onSubmit, isLoading } = useCreateProductForm();

  return (
    <Form {...form.form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The name displayed in the catalog.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
```

---

## Update Form with Data

```tsx
// forms/products/use-update-product-form.ts
export function useUpdateProductForm(product: Product) {
  const mutation = useUpdateProduct();
  
  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description ?? '',
      isActive: product.isActive,
    },
    mode: 'onBlur',
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync({ id: product.id, dto: data });
    } catch (error) {
      // Handle server errors
    }
  });

  return { form, onSubmit, isLoading: mutation.isPending };
}
```

---

## Server Error Handling

```typescript
// Handle different server errors
const onSubmit = form.handleSubmit(async (data) => {
  try {
    await mutation.mutateAsync(data);
    form.reset();
  } catch (error) {
    if (error.response?.status === 409) {
      // Conflict - field-specific error
      form.setError('name', {
        message: error.response.data.message || 'Name already exists',
      });
    } else if (error.response?.status === 422) {
      // Validation error from server
      const serverErrors = error.response.data.errors;
      Object.keys(serverErrors).forEach(field => {
        form.setError(field as keyof CreateProductFormData, {
          message: serverErrors[field],
        });
      });
    } else if (error.response?.status === 401) {
      // Unauthorized - redirect or show global error
      toast.error('Session expired. Please log in again.');
    } else {
      // Generic error - show toast
      toast.error('Something went wrong. Please try again.');
    }
  }
});
```

---

## With Optimistic Updates

```typescript
// use-create-product-form.ts with optimistic update consideration
export function useCreateProductForm() {
  const queryClient = useQueryClient();
  const mutation = useCreateProduct();
  
  const form = useForm({ /* config */ });

  const onSubmit = form.handleSubmit(async (data) => {
    // Optimistic updates would be in the mutation definition
    // Form just needs to handle the result
    
    try {
      await mutation.mutateAsync(data);
      form.reset();
      toast.success('Product created successfully');
      
      // Optionally redirect
      router.push('/products');
    } catch (error) {
      // Error handling
    }
  });

  return { form, onSubmit, mutation };
}
```

---

## Delete Confirmation

```tsx
// forms/products/use-delete-product-form.ts
export function useDeleteProductForm() {
  const mutation = useDeleteProduct();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const form = useForm({
    defaultValues: {
      confirmName: '',
    },
  });

  const onConfirm = form.handleSubmit(async (data) => {
    if (data.confirmName !== productName) {
      form.setError('confirmName', { 
        message: 'Type the product name exactly' 
      });
      return;
    }

    try {
      await mutation.mutateAsync(productId);
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  });

  return { form, onConfirm, showConfirm, setShowConfirm };
}
```

---

## Best Practices

1. **Reset form on success** — Clear data after successful submit
2. **Handle server errors** — Map server errors to form fields
3. **Disable during submission** — Prevent double submit
4. **Show loading state** — Give feedback to user
5. **Use mutation hooks** — From api-fetching skill

---

## References

- SKILL.md: Forms overview
- `rules/form-hook-usage.md`: useForm configuration
- `api-fetching` skill: useMutation patterns
- `templates/form-mutation.template.ts`: Full template
