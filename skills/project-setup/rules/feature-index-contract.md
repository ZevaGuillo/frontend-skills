# Rule: Feature index.ts as Public Contract

> Every feature exposes its public API through index.ts. This file is the only contract between features. Internal implementations are never directly imported.

## Why It Matters

- **Encapsulation guarantee** — Consumers only access what you explicitly export
- **Refactoring safety** — Internal changes don't break consumers
- **Discovery** — Developers know exactly what's available by reading index.ts
- **Enforced boundaries** — ESLint can verify no direct internal imports

---

## What to Export

### DO Export:

1. **Entry components** — Components that orchestrate the feature UI
2. **Integration hooks** — Hooks that components use to interact with the feature
3. **Public types** — Types that consumers need to work with the feature
4. **Use cases (if exported)** — Application layer functions if consumed externally

### DO NOT Export:

1. **Internal utilities** — `formatCurrency`, `calculateTotals`
2. **Zod schemas** — `productSchema`, `createProductSchema`
3. **Repository implementations** — `ProductRepository` class
4. **API clients** — `productsApi` object
5. **Domain interfaces** — `IProductRepository` (unless needed)

---

## Complete Example: products/index.ts

```typescript
// features/products/index.ts

// =============================================================================
// Domain Types — Public types consumers need
// =============================================================================
export type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  PaginatedResponse,
} from './domain/types/product.types';

// =============================================================================
// Application Use Cases — Business logic exposed as functions
// =============================================================================
export { GetProductsUseCase } from './application/use-cases/GetProducts';
export { GetProductByIdUseCase } from './application/use-cases/GetProductById';
export { CreateProductUseCase } from './application/use-cases/CreateProduct';
export { UpdateProductUseCase } from './application/use-cases/UpdateProduct';
export { DeleteProductUseCase } from './application/use-cases/DeleteProduct';

// =============================================================================
// Presentation Components — Entry point components for UI
// =============================================================================
export { ProductList } from './presentation/components/ProductList';
export { ProductCard } from './presentation/components/ProductCard';
export { ProductForm } from './presentation/components/ProductForm';
export { ProductDetail } from './presentation/components/ProductDetail';
export { ProductTable } from './presentation/components/ProductTable';
export { ProductFiltersPanel } from './presentation/components/ProductFiltersPanel';

// Re-export all components as named export
export type { ProductListProps } from './presentation/components/ProductList';
export type { ProductCardProps } from './presentation/components/ProductCard';
export type { ProductFormProps } from './presentation/components/ProductForm';

// =============================================================================
// Presentation Hooks — Integration hooks for components
// =============================================================================
export { useProducts } from './presentation/hooks/use-products';
export { useProduct } from './presentation/hooks/use-product';
export { useCreateProduct } from './presentation/hooks/use-create-product';
export { useUpdateProduct } from './presentation/hooks/use-update-product';
export { useDeleteProduct } from './presentation/hooks/use-delete-product';
export { useProductsInfinite } from './presentation/hooks/use-products-infinite';

// =============================================================================
// Page Components — Route handlers (if applicable)
// =============================================================================
export { ProductsPage } from './presentation/pages/ProductsPage';
export { ProductDetailPage } from './presentation/pages/ProductDetailPage';
export { ProductEditPage } from './presentation/pages/ProductEditPage';
```

---

## Barrel Pattern: Controlled vs Indiscriminate

### Controlled Barrel (Recommended)

```typescript
// ✅ RECOMMENDED: Re-export from submodules explicitly
// features/products/index.ts
export { ProductList } from './presentation/components/ProductList';
export { ProductCard } from './presentation/components/ProductCard';
```

**Advantages:**
- Explicit about what's public
- IDE shows exactly what's exported
- Easy to search for usage (`import from '@/features/products'`)

### Indiscriminate Barrel (Avoid)

```typescript
// ❌ AVOID: Re-export everything from a submodule
// features/products/index.ts
export * from './presentation/components';
export * from './presentation/hooks';
export * from './domain/types';
```

**Disadvantages:**
- Accidentally exposes internal files
- Impossible to track what's actually public
- IDE autocomplete is noisy
- Hard to enforce what can be imported

---

## Incorrect Exports (Anti-Patterns)

### ❌ Exporting Zod Schemas

```typescript
// ❌ INCORRECT: Zod schemas should never be exported
// features/products/index.ts
export { productSchema, createProductSchema } from './infrastructure/schemas/product.schema';
export { ProductRepository } from './infrastructure/repositories/ProductRepository';
```

**Why it's wrong:** Schemas are implementation details. If consumers need validation, create a typed DTO and validate internally.

### ❌ Exporting Internal Utilities

```typescript
// ❌ INCORRECT: Utilities are implementation details
// features/products/index.ts
export { formatProductPrice } from './presentation/components/ProductCard/formatProductPrice';
export { calculateDiscount } from './application/services/discount-calculator';
```

### ❌ Exporting Infrastructure

```typescript
// ❌ INCORRECT: API clients and repositories are internal
// features/products/index.ts
export { productsApi } from './infrastructure/api/products.api';
export { ProductRepository } from './infrastructure/repositories/ProductRepository';
```

---

## Correct Exports (Patterns)

### ✅ Exporting Components with Props

```typescript
// ✅ CORRECT: Export components with their prop types
// features/products/index.ts
export { ProductCard } from './presentation/components/ProductCard';
export type { ProductCardProps } from './presentation/components/ProductCard';
```

### ✅ Exporting Hooks

```typescript
// ✅ CORRECT: Export hooks for feature integration
// features/products/index.ts
export { useProducts } from './presentation/hooks/use-products';
export { useCreateProduct } from './presentation/hooks/use-create-product';
```

### ✅ Exporting Types

```typescript
// ✅ CORRECT: Export types consumers need to work with the feature
// features/products/index.ts
export type { Product, ProductFilters, CreateProductDto } from './domain/types';
```

---

## Consumer Usage

### Correct: Import from feature index

```typescript
// ✅ CORRECT: Consumer imports from feature public contract
// features/orders/presentation/components/OrderProduct.tsx
import { ProductCard, useProducts, type Product } from '@/features/products';

function OrderProduct({ productId }: { productId: string }) {
  const { data: product } = useProduct(productId);
  return <ProductCard product={product} />;
}
```

### Incorrect: Import internal files

```typescript
// ❌ INCORRECT: Consumer imports from internal files
import { ProductCard } from '@/features/products/presentation/components/ProductCard';
import { productsApi } from '@/features/products/infrastructure/api/products.api';
```

---

## Generating index.ts Automatically

The agent should regenerate index.ts on every feature modification:

```bash
# Example: Generate index.ts from feature structure
# (Agent implements this logic)
```

The generation logic:
1. Scan `presentation/components/` → export all components
2. Scan `presentation/hooks/` → export all hooks
3. Scan `domain/types/` → export public types
4. Scan `application/use-cases/` → export use cases
5. Create prop type exports for components

---

## ESLint Rule for Enforcement

```javascript
// eslint.config.mjs
export default tseslint.config(
  {
    rules: {
      'no-restricted-paths': [
        'error',
        {
          basePath: './src/features',
          from: {
            pattern: '*/presentation/components/*',
            except: ['*/index.ts']
          }
        }
      ]
    }
  }
);
```

---

## Exceptions Valid

| Scenario | Treatment |
|----------|-----------|
| Schema needed by consumer | Create typed DTO, validate in use case |
| Repository needed for testing | Export factory function, not class |
| Internal utility used by multiple | Move to shared/, not feature |

---

## References

- SKILL.md: Feature contract overview
- `rules/struct-feature-anatomy.md`: Layer structure
- `rules/struct-dependency-graph.md`: Import rules
- `templates/feature-index.template.ts`: Complete template
