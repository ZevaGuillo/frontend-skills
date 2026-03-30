# Rule: Three-Layer Architecture

> Every API interaction follows a three-layer pattern: api → repository → hook. This separation ensures testability, maintainability, and clear responsibilities.

## Why It Matters

- **Testability** — Mock at layer boundaries
- **Maintainability** — Changing HTTP client only affects api layer
- **Reusability** — Repository can be used from any hook
- **Type safety** — Types centralized and shared

---

## Layer Responsibilities

### Layer 1: api/ — HTTP Only

**Responsibility:** Pure HTTP calls. No business logic.

```typescript
// api/products.api.ts
import { axios } from '@/lib/axios';
import { Product, CreateProductDto } from './types';

export const productsApi = {
  getAll: (params?: ProductFilters) =>
    axios.get<PaginatedResponse<Product>>('/products', { params }),

  getById: (id: string) =>
    axios.get<Product>(`/products/${id}`),

  create: (data: CreateProductDto) =>
    axios.post<Product>('/products', data),

  update: (id: string, data: Partial<CreateProductDto>) =>
    axios.patch<Product>(`/products/${id}`, data),

  delete: (id: string) =>
    axios.delete(`/products/${id}`),
};
```

### Layer 2: repository/ — Business Logic

**Responsibility:** Transform data, apply business rules, handle domain errors.

```typescript
// repositories/products.repository.ts
import { productsApi } from '@/api/products.api';
import { Product, CreateProductDto, ProductFilters } from './types';

export const productsRepository = {
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const { data } = await productsApi.getAll(filters);
    return data;
  },

  async getProductById(id: string): Promise<Product> {
    const { data } = await productsApi.getById(id);
    return data;
  },

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const { data } = await productsApi.create(dto);
    return data;
  },

  async updateProduct(id: string, dto: Partial<CreateProductDto>): Promise<Product> {
    const { data } = await productsApi.update(id, dto);
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    await productsApi.delete(id);
  },
};
```

### Layer 3: hook/ — TanStack Query Integration

**Responsibility:** Integrate with TanStack Query, expose state to components.

```typescript
// hooks/use-products.ts
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

---

## Incorrect Example

```typescript
// ❌ Component does EVERYTHING: HTTP, logic, Query state
function ProductList() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => axios.get('/api/products').then(r => r.data)
  });
  
  if (isLoading) return <Spinner />;
  
  return <ul>{data.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

**Problems:**
- Mixed concerns
- Not testable without mocking useQuery
- Duplication if another component needs products
- Types scattered

---

## Correct Example

```typescript
// ✅ api/products.api.ts — HTTP only
// ✅ repositories/products.repository.ts — Business logic
// ✅ hooks/use-products.ts — Query integration
// ✅ components/ProductList.tsx — UI only

// components/ProductList.tsx
import { useProducts } from '@/hooks/use-products';

function ProductList() {
  const { data, isLoading } = useProducts();
  
  if (isLoading) return <Spinner />;
  
  return <ul>{data?.data.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

---

## Exceptions Valid

| Scenario | Treatment |
|----------|-----------|
| Very simple API (1-2 endpoints) | Omit repository if no transformation |
| GraphQL | Same pattern with graphql-request |
| WebSockets | Repository handles subscription |
| Offline-first | Repository decides cache strategy |

---

## References

- SKILL.md: Three-layer overview
- `rules/query-keys.md`: Query key constants
- `rules/no-use-query-directly.md`: Hook usage
- `rules/error-handling.md`: Error handling
