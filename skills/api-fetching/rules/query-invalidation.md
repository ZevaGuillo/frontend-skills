# Rule: Query Invalidation After Mutations

> After any mutation, invalidate related queries to ensure data consistency. The cache must reflect the server state.

## Why It Matters

- **Data consistency** — Cache matches server after mutations
- **Automatic refresh** — Users see updated data without manual refresh
- **Bug prevention** — Stale data doesn't persist after changes

---

## Basic Invalidation

```typescript
// hooks/use-create-product.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsRepository } from '@/repositories/products.repository';
import { QUERY_KEYS } from '@/repositories/query-keys';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsRepository.createProduct,
    onSuccess: () => {
      // Invalidate ALL product queries
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.all 
      });
    },
  });
}
```

---

## Targeted Invalidation

```typescript
// Invalidate specific queries instead of all
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsRepository.createProduct,
    onSuccess: () => {
      // Invalidate only the list, not details
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.lists() 
      });
      
      // Invalidate with specific filters
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.list({ active: true }) 
      });
    },
  });
}
```

---

## Invalidation with Filters

```typescript
// When creating a product with category, invalidate only that category
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: CreateProductDto) => 
      productsRepository.createProduct(dto),
    onSuccess: (newProduct) => {
      // Invalidate all product lists
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.lists() 
      });
      
      // Also invalidate category-specific list
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.list({ category: newProduct.category }) 
      });
    },
  });
}
```

---

## Multiple Entity Invalidation

```typescript
// When creating an order, invalidate both orders AND products (inventory)
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ordersRepository.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.orders.all 
      });
      
      // Products may have changed inventory
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.lists() 
      });
    },
  });
}
```

---

## Invalidation with Optimistic Updates

```typescript
// Combine optimistic update with invalidation
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dto }) => productsRepository.updateProduct(id, dto),
    
    onMutate: async ({ id, dto }) => {
      await queryClient.cancelQueries({ 
        queryKey: QUERY_KEYS.products.detail(id) 
      });
      
      const previousProduct = queryClient.getQueryData(
        QUERY_KEYS.products.detail(id)
      );
      
      queryClient.setQueryData(
        QUERY_KEYS.products.detail(id),
        (old) => old ? { ...old, ...dto } : old
      );
      
      return { previousProduct };
    },
    
    onError: (_err, { id }, context) => {
      if (context?.previousProduct) {
        queryClient.setQueryData(
          QUERY_KEYS.products.detail(id),
          context.previousProduct
        );
      }
    },
    
    onSettled: (_data, _err, { id }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.detail(id) 
      });
    },
  });
}
```

---

## Incorrect Example

```typescript
// ❌ NO invalidation — cache becomes stale
function UpdateProduct() {
  const mutation = useMutation({
    mutationFn: productsRepository.updateProduct,
    // Missing onSuccess invalidation!
  });
  
  // User updates product, but list still shows old data
  return <Form onSubmit={mutation.mutate} />;
}
```

---

## Best Practices

1. **Invalidate after success** — Always invalidate in `onSuccess`
2. **Be specific** — Invalidate only related queries
3. **Consider filters** — Invalidate with matching filters
4. **Multiple entities** — Invalidate all affected entities
5. **Combine with optimistic** — Use both for best UX

---

## References

- SKILL.md: Mutations overview
- `rules/optimistic-updates.md`: Optimistic patterns
- `rules/query-keys.md`: Query key structure
