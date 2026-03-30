# Rule: Feature Folder Anatomy

> Every feature is a self-contained module with four distinct layers. This rule defines the complete anatomy and when to use each layer.

## Why It Matters

A well-structured feature folder:
- **Tells developers what the system does** by reading folder names (screaming architecture)
- **Enforces single responsibility** — each layer has one job
- **Enables independent testing** — mock at layer boundaries
- **Prevents accidental coupling** — imports are structurally visible
- **Scales without chaos** — 100 features look like 1 feature

---

## Complete Feature Anatomy

```
src/features/products/
├── domain/                              # Layer 1: Pure types, entities, interfaces
│   ├── entities/
│   │   └── Product.ts                   # Core entity interface/type
│   ├── types/
│   │   └── product.types.ts              # DTOs, filters, response types
│   ├── interfaces/
│   │   └── IProductRepository.ts         # Repository contract
│   └── index.ts                          # Barrel: domain public API
│
├── application/                         # Layer 2: Business logic orchestration
│   ├── use-cases/
│   │   ├── GetProducts.ts                # Single responsibility: fetch products
│   │   ├── GetProductById.ts             # Single responsibility: fetch one product
│   │   ├── CreateProduct.ts              # Single responsibility: create product
│   │   ├── UpdateProduct.ts              # Single responsibility: update product
│   │   └── DeleteProduct.ts               # Single responsibility: delete product
│   ├── services/
│   │   └── ProductService.ts              # Complex orchestration (optional)
│   └── index.ts                          # Barrel: use cases public API
│
├── infrastructure/                       # Layer 3: External implementations
│   ├── api/
│   │   └── products.api.ts               # HTTP calls (axios/fetch) — pure transport
│   ├── repositories/
│   │   └── ProductRepository.ts          # Implements IProductRepository
│   └── index.ts                          # Barrel: infrastructure public API
│
├── presentation/                        # Layer 4: React UI
│   ├── components/
│   │   ├── ProductList.tsx               # List container component
│   │   ├── ProductCard.tsx               # Single item display
│   │   ├── ProductForm.tsx               # Create/edit form
│   │   ├── ProductTable.tsx              # Table view (if applicable)
│   │   └── index.ts                      # Barrel: all components
│   ├── hooks/
│   │   ├── use-products.ts               # Query hooks
│   │   ├── use-product.ts                # Single product hook
│   │   ├── use-create-product.ts         # Mutation hook
│   │   ├── use-update-product.ts          # Mutation hook
│   │   ├── use-delete-product.ts          # Mutation hook
│   │   └── index.ts                      # Barrel: all hooks
│   ├── pages/
│   │   ├── ProductsPage.tsx              # Page composition (Next.js/TanStack)
│   │   ├── ProductDetailPage.tsx         # Page composition
│   │   └── index.ts                      # Barrel: all pages
│   └── index.ts                          # Barrel: presentation public API
│
├── README.md                             # Auto-generated documentation
└── index.ts                              # Feature public contract
```

---

## Layer Responsibilities

### Domain Layer (`domain/`)

**Purpose:** Pure types, entities, and interfaces. Zero dependencies on other project code.

**What goes here:**
- Entity interfaces/types (`Product`, `User`, `Order`)
- DTOs (`CreateProductDto`, `UpdateProductDto`, `ProductFilters`)
- Repository interfaces (`IProductRepository`)
- Value objects (optional: `Money`, `Address`)

**What NEVER goes here:**
- API calls
- React components
- Business logic
- Any import from `../application/`, `../infrastructure/`, `../presentation/`

```typescript
// domain/entities/Product.ts
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
```

```typescript
// domain/types/product.types.ts
import { Product } from '../entities/Product';

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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

```typescript
// domain/interfaces/IProductRepository.ts
import { Product, CreateProductDto, UpdateProductDto, ProductFilters, PaginatedResponse } from '../types';

export interface IProductRepository {
  findAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
  findById(id: string): Promise<Product | null>;
  create(dto: CreateProductDto): Promise<Product>;
  update(id: string, dto: UpdateProductDto): Promise<Product>;
  delete(id: string): Promise<void>;
  bulkDelete(ids: string[]): Promise<void>;
}
```

### Application Layer (`application/`)

**Purpose:** Use cases that orchestrate business logic. Depends only on domain.

**What goes here:**
- Use case classes/functions (`GetProducts`, `CreateProduct`)
- Application services (complex orchestration when needed)
- Business rules that involve multiple entities

**What NEVER goes here:**
- Direct API calls (that's infrastructure)
- React components or hooks (that's presentation)
- Direct imports from `../infrastructure/` or `../presentation/`

```typescript
// application/use-cases/GetProducts.ts
import { IProductRepository } from '../../domain/interfaces/IProductRepository';
import { Product, ProductFilters, PaginatedResponse } from '../../domain/types';

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    // Business logic goes here
    // Example: transform filters, apply business rules, etc.
    return this.productRepository.findAll(filters);
  }
}
```

### Infrastructure Layer (`infrastructure/`)

**Purpose:** External implementations — API calls, repository implementations, storage.

**What goes here:**
- API client functions (`products.api.ts`)
- Repository implementations (`ProductRepository implements IProductRepository`)
- External service integrations (AWS S3, Stripe, etc.)

**What goes NEVER here:**
- Business logic (that's application)
- React components (that's presentation)
- Direct imports from `../presentation/`

```typescript
// infrastructure/api/products.api.ts
import { axios } from '@/lib/axios';
import { Product, CreateProductDto, UpdateProductDto, ProductFilters, PaginatedResponse } from '../../domain/types';

export const productsApi = {
  getAll: (params?: ProductFilters) =>
    axios.get<PaginatedResponse<Product>>('/products', { params }),

  getById: (id: string) =>
    axios.get<Product>(`/products/${id}`),

  create: (data: CreateProductDto) =>
    axios.post<Product>('/products', data),

  update: (id: string, data: UpdateProductDto) =>
    axios.patch<Product>(`/products/${id}`),

  delete: (id: string) =>
    axios.delete(`/products/${id}`),

  bulkDelete: (ids: string[]) =>
    axios.delete('/products/bulk', { data: { ids } }),
};
```

```typescript
// infrastructure/repositories/ProductRepository.ts
import { IProductRepository } from '../../domain/interfaces/IProductRepository';
import { Product, CreateProductDto, UpdateProductDto, ProductFilters, PaginatedResponse } from '../../domain/types';
import { productsApi } from '../api/products.api';

export class ProductRepository implements IProductRepository {
  async findAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const { data } = await productsApi.getAll(filters);
    return data;
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const { data } = await productsApi.getById(id);
      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const { data } = await productsApi.create(dto);
    return data;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const { data } = await productsApi.update(id, dto);
    return data;
  }

  async delete(id: string): Promise<void> {
    await productsApi.delete(id);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await productsApi.bulkDelete(ids);
  }
}
```

### Presentation Layer (`presentation/`)

**Purpose:** React components, hooks, and page compositions. Depends on all other layers.

**What goes here:**
- React components
- Custom hooks (`useProducts`, `useCreateProduct`)
- Page components (route handlers)

**What goes NEVER here:**
- Direct API calls (use infrastructure layer)
- Business logic (use application layer)

```typescript
// presentation/hooks/use-products.ts
import { useQuery } from '@tanstack/react-query';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { ProductFilters, QUERY_KEYS } from '../../domain/types';

const productRepository = new ProductRepository();

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.products.list(filters),
    queryFn: () => productRepository.findAll(filters),
    staleTime: 1000 * 60 * 5,
  });
}
```

---

## Decision Guide: Feature vs Shared

### Put code IN the feature when:

- The code is specific to that feature's domain
- It will never be used by another feature
- It references feature-specific types/entities

### Put code IN shared/ when:

- The code is used by 3+ features
- It's a general utility (date formatting, validation)
- It's a cross-cutting concern (auth, logger, config)
- It's a UI primitive (Button, Input, Modal) → use shadcn/ui

**The 20% rule:** `shared/` should contain maximum 20% of total project code. If it grows beyond:
1. Features are poorly scoped (reusing too much = too coupled)
2. Consider extracting a new feature
3. Or accept the coupling and document it in each feature's README

---

## File Size Limits

**Maximum 200 lines per file.** If exceeded, split the file.

```typescript
// ❌ BAD: 300+ lines in one file
// presentation/components/ProductList.tsx

// ✅ GOOD: Split into smaller components
// presentation/components/ProductList.tsx         (composition)
// presentation/components/ProductListItem.tsx    (single item)
// presentation/components/ProductListFilters.tsx (filter UI)
```

---

## Exceptions Valid

| Scenario | Treatment |
|----------|-----------|
| Very simple feature (1-2 CRUD) | Collapse layers: domain+application, or application+infrastructure |
| Feature is just UI components | Omit application layer entirely |
| Third-party SDK integration | Add `infrastructure/external/` subfolder |
| Complex form with many fields | `presentation/components/forms/ProductForm/` as subfolder |

---

## References

- SKILL.md: Feature anatomy overview
- `rules/struct-dependency-graph.md`: Import rules between layers
- `rules/feature-index-contract.md`: How to write index.ts
- `rules/naming-conventions.md`: File and folder naming
