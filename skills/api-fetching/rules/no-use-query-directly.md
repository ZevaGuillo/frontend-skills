# Rule: Never Use useQuery Directly in Components

> Components must never use `useQuery` or `useMutation` directly. Always go through custom hooks that encapsulate the TanStack Query logic.

## Why It Matters

- **Consistency** — All queries follow the same pattern
- **Testability** — Hooks can be mocked easily
- **Reusability** — Same hook across components
- **Centralization** — Query configuration in one place

---

## Incorrect Example

```typescript
// ❌ DON'T use useQuery directly in components
function ProductList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => axios.get('/api/products').then(r => r.data),
  });

  if (isLoading) return <Skeleton />;
  if (error) return <Error message={error.message} />;
  
  return <ul>{data.map(p => <ProductItem key={p.id} product={p} />)}</ul>;
}

// ❌ DON'T use useMutation directly
function CreateProduct() {
  const mutation = useMutation({
    mutationFn: (data) => axios.post('/api/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
  
  const handleSubmit = (data) => mutation.mutate(data);
  
  return <Form onSubmit={handleSubmit} />;
}
```

**Problems:**
- Duplicated query configuration
- Inconsistent error handling
- Hard to test
- Mixed concerns

---

## Correct Example

```typescript
// ✅ hooks/use-products.ts — Encapsulates useQuery
import { useQuery } from '@tanstack/react-query';
import { productsRepository } from '@/repositories/products.repository';
import { QUERY_KEYS } from '@/repositories/query-keys';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.products.list(filters),
    queryFn: () => productsRepository.getProducts(filters),
    staleTime: 1000 * 60 * 5,
  });
}
```

```typescript
// ✅ hooks/use-create-product.ts — Encapsulates useMutation
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsRepository } from '@/repositories/products.repository';
import { QUERY_KEYS } from '@/repositories/query-keys';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsRepository.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.all 
      });
    },
  });
}
```

```typescript
// ✅ components/ProductList.tsx — Uses hook only
import { useProducts } from '@/hooks/use-products';

function ProductList() {
  const { data, isLoading, error } = useProducts();
  
  if (isLoading) return <Skeleton />;
  if (error) return <Error message={error.message} />;
  
  return <ul>{data?.data.map(p => <ProductItem key={p.id} product={p} />)}</ul>;
}
```

---

## Pattern Summary

```
Component → useProducts() hook → productsRepository → productsApi
                ↓                    ↓
           useQuery()          axios.get()
```

---

## Exceptions Valid

| Scenario | Treatment |
|----------|-----------|
| Very simple prototype | Accept small duplication for speed |
| One-off query | Consider if it will be reused |
| Debugging | Temporary direct use is OK, then extract |

---

## References

- SKILL.md: Hook usage overview
- `rules/three-layer-pattern.md`: Layer architecture
- `templates/useEntity.template.ts`: Complete hook template
