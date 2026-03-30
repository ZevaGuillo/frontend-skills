# Rule: Optimistic Updates for Mutations

> Mutations should implement optimistic updates for better UX. Update cache immediately, then rollback on error.

## Why It Matters

- **Better UX** — Users see immediate feedback
- **Perceived performance** — No loading spinner for every action
- **Rollback on error** — Restore previous state if mutation fails

---

## Pattern: Optimistic Update

```typescript
// hooks/use-update-product.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsRepository } from '@/repositories/products.repository';
import { QUERY_KEYS } from '@/repositories/query-keys';

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
      productsRepository.updateProduct(id, dto),
    
    // Called before mutationFn
    onMutate: async ({ id, dto }) => {
      // Cancel any outgoing queries to avoid overwriting
      await queryClient.cancelQueries({ 
        queryKey: QUERY_KEYS.products.detail(id) 
      });
      
      // Snapshot previous value
      const previousProduct = queryClient.getQueryData(
        QUERY_KEYS.products.detail(id)
      );
      
      // Optimistically update cache
      queryClient.setQueryData(
        QUERY_KEYS.products.detail(id),
        (old: Product | undefined) => old ? { ...old, ...dto } : old
      );
      
      // Return context with previous product for rollback
      return { previousProduct };
    },
    
    // Called if mutation errors
    onError: (_err, { id }, context) => {
      if (context?.previousProduct) {
        queryClient.setQueryData(
          QUERY_KEYS.products.detail(id),
          context.previousProduct
        );
      }
    },
    
    // Always refetch after error or success
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.detail(id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.lists() 
      });
    },
  });
}
```

---

## Delete with Optimistic Update

```typescript
// hooks/use-delete-product.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsRepository } from '@/repositories/products.repository';
import { QUERY_KEYS } from '@/repositories/query-keys';

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productsRepository.deleteProduct(id),
    
    onMutate: async (id) => {
      await queryClient.cancelQueries({ 
        queryKey: QUERY_KEYS.products.all 
      });
      
      // Snapshot all product lists
      const previousProducts = queryClient.getQueriesData<Product>(
        QUERY_KEYS.products.lists()
      );
      
      // Optimistically remove from all lists
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.products.lists() },
        (old: PaginatedResponse<Product> | undefined) => 
          old ? { 
            ...old, 
            data: old.data.filter(p => p.id !== id),
            total: old.total - 1,
          } : old
      );
      
      return { previousProducts };
    },
    
    onError: (_err, _id, context) => {
      if (context?.previousProducts) {
        context.previousProducts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.all 
      });
    },
  });
}
```

---

## Create with List Update

```typescript
// hooks/use-create-product.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsRepository } from '@/repositories/products.repository';
import { QUERY_KEYS } from '@/repositories/query-keys';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsRepository.createProduct,
    
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.all 
      });
      
      // Alternatively, manually add to cache
      queryClient.setQueryData(
        QUERY_KEYS.products.list(),
        (old: PaginatedResponse<Product> | undefined) => 
          old ? {
            ...old,
            data: [newProduct, ...old.data],
            total: old.total + 1,
          } : old
      );
    },
  });
}
```

---

## Incorrect Example

```typescript
// ❌ NO optimistic update — shows loading spinner
function UpdateProduct({ id }: { id: string }) {
  const mutation = useMutation({
    mutationFn: (dto) => productsRepository.updateProduct(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
  
  // User sees loading spinner after every save
  return <Form onSubmit={mutation.mutate} isLoading={mutation.isPending} />;
}
```

---

## When to Use

| Operation | Use Optimistic Update? |
|-----------|----------------------|
| Create | ✅ Yes — Show new item immediately |
| Update | ✅ Yes — Show changes immediately |
| Delete | ✅ Yes — Remove from list immediately |
| Complex transaction | ❌ No — Wait for server confirmation |
| Payment/transaction | ❌ No — Wait for server confirmation |

---

## References

- SKILL.md: Mutations overview
- `rules/query-invalidation.md`: Invalidation patterns
- `rules/error-handling.md`: Rollback on error
