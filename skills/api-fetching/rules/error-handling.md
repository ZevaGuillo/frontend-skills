# Rule: Error Handling in Three Levels

> Errors must be handled at three levels: QueryClient (global), Repository (domain), and Hook (presentation). Never leave errors unhandled.

## Why It Matters

- **Consistent UX** — Users see structured errors, not stack traces
- **Maintainability** — Change error logic in one place
- **Testability** — Each level tested independently
- **Security** — Don't expose internal details to clients

---

## Level 1: QueryClient (Global)

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('[Query Error]', error);
      },
    },
    mutations: {
      onError: (error) => {
        console.error('[Mutation Error]', error);
      },
    },
  },
});
```

---

## Level 2: Repository (Domain)

```typescript
// repositories/products.repository.ts
import { productsApi } from '@/api/products.api';
import { ApiError } from '@/lib/api-error';

export const productsRepository = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data } = await productsApi.getAll();
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new ApiError('Session expired', 'UNAUTHORIZED');
        }
        if (error.response?.status === 404) {
          throw new ApiError('Products not found', 'NOT_FOUND');
        }
        throw new ApiError(
          error.response?.data?.message || 'Failed to fetch products',
          'FETCH_ERROR'
        );
      }
      throw new ApiError('Connection error', 'NETWORK_ERROR');
    }
  },
};
```

```typescript
// lib/api-error.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
  
  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}
```

---

## Level 3: Hook (Presentation)

```typescript
// hooks/use-products.ts
import { useQuery } from '@tanstack/react-query';
import { productsRepository } from '@/repositories/products.repository';
import { QUERY_KEYS } from '@/repositories/query-keys';

export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.products.list(),
    queryFn: () => productsRepository.getProducts(),
  });
}
```

```typescript
// components/ProductList.tsx
import { useProducts } from '@/hooks/use-products';

function ProductList() {
  const { data, isLoading, isError, error } = useProducts();
  
  if (isLoading) return <Skeleton />;
  
  if (isError) {
    return (
      <ErrorMessage 
        title="Failed to load products"
        message={error?.message}
        onRetry={() => queryClient.invalidateQueries({ 
          queryKey: QUERY_KEYS.products.all 
        })}
      />
    );
  }
  
  return <ul>{data?.map(p => <ProductItem key={p.id} product={p} />)}</ul>;
}
```

---

## Error Strategy by Operation

| Operation | Error Strategy |
|-----------|----------------|
| **List** | Show generic message, option to retry |
| **Detail** | Redirect to 404 if 404, generic message for others |
| **Create** | Show error on form, keep form data |
| **Update** | Automatic rollback via optimistic update |
| **Delete** | Confirmation before, undo toast if possible |

---

## Incorrect Example

```typescript
// ❌ NO error handling — DON'T DO THIS
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(r => r.json()),
});

// Shows technical error to user
return <div>{data?.map(u => u.name)}</div>;

// ❌ Empty catch — EVEN WORSE
async function getData() {
  try {
    const r = await fetch('/api/users');
    return r.json();
  } catch (e) {
    console.error(e); // Silently fails
    return [];
  }
}
```

---

## Exceptions Valid

| Scenario | Treatment |
|----------|-----------|
| Offline | Show "offline" state with cached data |
| Timeout | Retry with backoff, then "service slow" message |
| Error 500 | Don't show server details to user |
| Rate limiting | Detect headers, show "wait X seconds" |

---

## References

- SKILL.md: Error handling overview
- `rules/three-layer-pattern.md`: Layer architecture
- `rules/optimistic-updates.md`: Rollback patterns
