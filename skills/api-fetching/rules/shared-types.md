# Rule: Shared Types Between Layers

> Types must be shared between layers via a central types file. Each feature has its own types file that exports all types used across api, repository, and hook layers.

## Why It Matters

- **Single source of truth** — Types defined once, used everywhere
- **Consistency** — Same type in api, repository, and hook
- **Refactoring** — Change type in one place, update everywhere
- **DX** — IDE autocomplete works across layers

---

## Type File Structure

```typescript
// features/products/domain/types/product.types.ts

// =============================================================================
// Core Entity
// =============================================================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'EUR' | 'GBP';
  category: string;
  images: string[];
  inventory: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// DTOs (Data Transfer Objects)
// =============================================================================

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'EUR' | 'GBP';
  category: string;
  images: string[];
  inventory: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  isActive?: boolean;
}

// =============================================================================
// Filters
// =============================================================================

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// Response Types
// =============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// =============================================================================
// Query Keys
// =============================================================================

export const QUERY_KEYS = {
  products: {
    all: ['products'] as const,
    lists: () => ['products', 'list'] as const,
    list: (filters?: ProductFilters) => 
      ['products', 'list', filters] as const,
    details: () => ['products', 'detail'] as const,
    detail: (id: string) => 
      ['products', 'detail', id] as const,
  },
} as const;
```

---

## Usage Across Layers

### API Layer

```typescript
// features/products/infrastructure/api/products.api.ts
import { axios } from '@/lib/axios';
import { Product, CreateProductDto, ProductFilters, PaginatedResponse } from '../../domain/types';

export const productsApi = {
  getAll: (params?: ProductFilters) =>
    axios.get<PaginatedResponse<Product>>('/products', { params }),

  getById: (id: string) =>
    axios.get<Product>(`/products/${id}`),

  create: (data: CreateProductDto) =>
    axios.post<Product>('/products', data),
    
  // ...
};
```

### Repository Layer

```typescript
// features/products/infrastructure/repositories/ProductRepository.ts
import { productsApi } from '../api/products.api';
import { Product, CreateProductDto, UpdateProductDto, ProductFilters, PaginatedResponse } 
  from '../../domain/types';

export class ProductRepository {
  async findAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const { data } = await productsApi.getAll(filters);
    return data;
  }
  
  async create(dto: CreateProductDto): Promise<Product> {
    const { data } = await productsApi.create(dto);
    return data;
  }
}
```

### Hook Layer

```typescript
// features/products/presentation/hooks/use-products.ts
import { useQuery } from '@tanstack/react-query';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { ProductFilters, PaginatedResponse, QUERY_KEYS } 
  from '../../domain/types';

const productRepository = new ProductRepository();

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.products.list(filters),
    queryFn: () => productRepository.findAll(filters),
  });
}
```

### Component Layer

```typescript
// features/products/presentation/components/ProductList.tsx
import { useProducts } from '../hooks/use-products';
import { Product, ProductFilters } from '../../domain/types';

function ProductList() {
  const { data } = useProducts();
  
  // data is typed as PaginatedResponse<Product>
  return (
    <ul>
      {data?.data.map((product: Product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

---

## Feature Index Export

```typescript
// features/products/index.ts
export type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  PaginatedResponse,
} from './domain/types/product.types';

export { QUERY_KEYS } from './domain/types/product.types';
```

---

## Incorrect Example

```typescript
// ❌ DON'T define types in each layer

// api/products.api.ts — duplicating types
export const productsApi = {
  getAll: () => axios.get<Product[]>('/products'), // Type here
};

// repositories/ProductRepository.ts — duplicating again
async getProducts(): Promise<Product[]> { // And here
  const { data } = await productsApi.getAll();
  return data;
}

// hooks/use-products.ts — duplicating a third time
const { data } = useQuery<{ data: Product[] }>({ // And here
  queryKey: ['products'],
  queryFn: () => repo.getProducts(),
});
```

---

## Correct: Single Source of Truth

```typescript
// ✅ types/product.types.ts — ONE place

// api, repository, hook — all import from here
import { Product } from '@/features/products/domain/types';
```

---

## Entity Naming Conventions

| Type | Naming | Example |
|------|--------|---------|
| Entity | `PascalCase` | `Product`, `User` |
| Create DTO | `Create` + Entity + `Dto` | `CreateProductDto` |
| Update DTO | `Update` + Entity + `Dto` | `UpdateProductDto` |
| Filters | Entity + `Filters` | `ProductFilters` |
| Response | `PaginatedResponse<T>` | `PaginatedResponse<Product>` |

---

## References

- SKILL.md: Types overview
- `rules/three-layer-pattern.md`: Layer architecture
- `templates/feature-types.template.ts`: Type template
