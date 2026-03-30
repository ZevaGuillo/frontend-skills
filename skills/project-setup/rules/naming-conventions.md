# Rule: Naming Conventions

> Consistent naming across files, components, hooks, and utilities. This rule defines the exact format for every type of identifier.

## Why It Matters

- **Predictability** — Developers know what to expect
- **Searchability** — Find files and symbols easily
- **Tooling** — Linters and IDEs work better with conventions
- **Onboarding** — New developers adapt faster

---

## Folder Names

### Feature Folders

| Type | Format | Example |
|------|--------|---------|
| Feature folder | `kebab-case` plural | `products/`, `user-settings/`, `order-items/` |

```bash
# ✅ CORRECT
src/features/products/
src/features/user-settings/
src/features/order-items/

# ❌ INCORRECT
src/features/Products/
src/features/user_settings/
src/features/Product/
```

### Layer Folders

| Type | Format | Example |
|------|--------|---------|
| Layer folder | `kebab-case` | `domain/`, `application/`, `infrastructure/`, `presentation/` |

```bash
# ✅ CORRECT
features/products/domain/
features/products/application/
features/products/infrastructure/
features/products/presentation/

# ❌ INCORRECT
features/products/Domain/
features/products/domainLayer/
```

---

## File Names

### Components

| Type | Format | Extension | Example |
|------|--------|-----------|---------|
| React component | `PascalCase` | `.tsx` | `ProductList.tsx`, `UserCard.tsx` |
| Component props | `PascalCase` + `Props` | `.tsx` | `ProductListProps.tsx` |
| Component test | Same name | `.test.tsx` | `ProductList.test.tsx` |

```typescript
// ✅ CORRECT
features/products/presentation/components/ProductList.tsx
features/products/presentation/components/UserCard.tsx
interface ProductListProps { ... }

// ❌ INCORRECT
features/products/presentation/components/product-list.tsx
features/products/presentation/components/ProductListComponent.tsx
```

### Hooks

| Type | Format | Extension | Example |
|------|--------|-----------|---------|
| Custom hook | `use` + `PascalCase` | `.ts` | `useProducts.ts`, `useAuth.ts` |

```typescript
// ✅ CORRECT
features/products/presentation/hooks/use-products.ts
features/products/presentation/hooks/use-product.ts

// ❌ INCORRECT
features/products/presentation/hooks/products-hook.ts
features/products/presentation/hooks/useProductsHook.ts
```

### Repositories

| Type | Format | Extension | Example |
|------|--------|-----------|---------|
| Repository | `PascalCase` + `Repository` | `.ts` | `ProductRepository.ts`, `UserRepository.ts` |

```typescript
// ✅ CORRECT
features/products/infrastructure/repositories/ProductRepository.ts

// ❌ INCORRECT
features/products/infrastructure/repositories/products.repository.ts
features/products/infrastructure/repositories/ProductRepo.ts
```

### API Clients

| Type | Format | Extension | Example |
|------|--------|-----------|---------|
| API client | `[Entity]` + `Api` | `.api.ts` | `products.api.ts`, `users.api.ts` |

```typescript
// ✅ CORRECT
features/products/infrastructure/api/products.api.ts

// ❌ INCORRECT
features/products/infrastructure/api/productsApi.ts
features/products/infrastructure/api/products-client.ts
```

### Schemas

| Type | Format | Extension | Example |
|------|--------|-----------|---------|
| Zod schema | `[Entity]` + `Schema` | `.schema.ts` | `product.schema.ts`, `user.schema.ts` |

```typescript
// ✅ CORRECT
features/products/infrastructure/schemas/product.schema.ts

// ❌ INCORRECT
features/products/infrastructure/schemas/ProductSchema.ts
features/products/infrastructure/schemas/productSchema.ts
```

### Types

| Type | Format | Extension | Example |
|------|--------|-----------|---------|
| Type file | `[entity]` + `.types` | `.ts` | `product.types.ts`, `user.types.ts` |

```typescript
// ✅ CORRECT
features/products/domain/types/product.types.ts
features/products/domain/types/user.types.ts

// ❌ INCORRECT
features/products/domain/types/ProductTypes.ts
features/products/domain/types/types.ts
```

### Utilities

| Type | Format | Extension | Example |
|------|--------|-----------|---------|
| Utility function | `[purpose]` + `.utils` | `.ts` | `date.utils.ts`, `format.utils.ts` |

```typescript
// ✅ CORRECT
shared/lib/date.utils.ts
shared/lib/format.utils.ts
shared/lib/currency.utils.ts

// ❌ INCORRECT
shared/lib/DateUtils.ts
shared/lib/formatCurrency.ts
shared/lib/format.ts
```

### Use Cases

| Type | Format | Extension | Example |
|------|--------|-----------|---------|
| Use case | `[Verb]` + `[Entity]` | `.ts` | `GetProducts.ts`, `CreateUser.ts` |

```typescript
// ✅ CORRECT
features/products/application/use-cases/GetProducts.ts
features/products/application/use-cases/CreateProduct.ts

// ❌ INCORRECT
features/products/application/use-cases/get-products.ts
features/products/application/use-cases/ProductGetter.ts
```

---

## Internal Naming

### Function Names

| Type | Format | Example |
|------|--------|---------|
| Regular function | `camelCase` | `getProducts()`, `formatPrice()` |
| Async function | `camelCase` (no special prefix) | `fetchProducts()`, `loadUser()` |
| Handler function | `camelCase` + `Handler` | `handleSubmit()`, `handleClick()` |

```typescript
// ✅ CORRECT
function getProducts(): Promise<Product[]> { ... }
async function fetchProducts() { ... }
function handleSubmit() { ... }

// ❌ INCORRECT
function GetProducts() { ... }
async function productsFetch() { ... }
function onSubmit() { ... }
```

### Variable Names

| Type | Format | Example |
|------|--------|---------|
| Regular variable | `camelCase` | `products`, `currentUser` |
| State variable | `camelCase` or prefix | `products`, `setProducts` or `products`, `productsSet` |
| Boolean variable | `is`/`has`/`can` prefix | `isLoading`, `hasError`, `canEdit` |
| Array variable | Plural noun | `products`, `users`, `items` |

```typescript
// ✅ CORRECT
const products = await fetchProducts();
const [products, setProducts] = useState([]);
const isLoading = true;
const hasPermission = user.canEdit;

// ❌ INCORRECT
const Products = await fetchProducts();
const [productsData, setProductsData] = useState([]);
const loading = true;
const permission = user.canEdit;
```

### Constant Names

| Type | Format | Example |
|------|--------|---------|
| Query keys | `SCREAMING_SNAKE_CASE` | `QUERY_KEYS`, `PRODUCTS_LIST` |
| Config constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Enum values | `SCREAMING_SNAKE_CASE` | `UserRole.ADMIN`, `OrderStatus.PENDING` |

```typescript
// ✅ CORRECT
export const QUERY_KEYS = {
  PRODUCTS: {
    ALL: ['products'],
    LIST: (filters) => ['products', 'list', filters],
  },
};

export const MAX_RETRY_COUNT = 3;
export const API_BASE_URL = process.env.API_URL;

// ❌ INCORRECT
export const queryKeys = { ... };
export const maxRetryCount = 3;
```

### Interface/Type Names

| Type | Format | Example |
|------|--------|---------|
| Entity interface | `PascalCase` | `Product`, `User`, `Order` |
| DTO | `[Verb]` + `Dto` | `CreateProductDto`, `UpdateUserDto` |
| Response type | `[Entity]` + `Response` | `ProductResponse`, `PaginatedResponse` |
| Filter type | `[Entity]` + `Filters` | `ProductFilters`, `UserFilters` |
| Props type | `[Component]` + `Props` | `ProductListProps`, `UserCardProps` |

```typescript
// ✅ CORRECT
interface Product { ... }
interface CreateProductDto { ... }
interface ProductFilters { ... }
interface ProductListProps { ... }

// ❌ INCORRECT
interface IProduct { ... }
interface ProductDTO { ... }
interface FilterProduct { ... }
interface IProductListProps { ... }
```

---

## CSS/Tailwind Classes

### Component Class Names

| Type | Format | Example |
|------|--------|---------|
| Component root | Single word | `product-list`, `user-card` |
| Element | Parent + element | `product-list__item`, `product-card__title` |
| Variant | `--` prefix | `product-list--grid`, `button--primary` |

```tsx
// ✅ CORRECT
<div className="product-list">
  <div className="product-list__item">
    <span className="product-list__item-title">{name}</span>
  </div>
</div>

// ❌ INCORRECT
<div className="ProductList">
  <div className="item">
    <span className="title">{name}</span>
  </div>
</div>
```

---

## ESLint Configuration

Add naming conventions to ESLint:

```javascript
// eslint.config.mjs
export default tseslint.config(
  {
    rules: {
      'filename/naming-convention': [
        'error',
        {
          '*.tsx': ['PascalCase', 'camelCase'],
          '*.ts': 'camelCase',
          '*.test.ts': 'camelCase',
        }
      ]
    }
  }
);
```

---

## Quick Reference Table

| Type | Format | Example |
|------|--------|---------|
| Feature folder | `kebab-case` plural | `products/` |
| Component file | `PascalCase.tsx` | `ProductList.tsx` |
| Component props | `PascalCaseProps.tsx` | `ProductListProps.tsx` |
| Hook file | `usePascalCase.ts` | `useProducts.ts` |
| Repository file | `PascalCaseRepository.ts` | `ProductRepository.ts` |
| API file | `camelCase.api.ts` | `products.api.ts` |
| Schema file | `camelCase.schema.ts` | `product.schema.ts` |
| Type file | `camelCase.types.ts` | `product.types.ts` |
| Utility file | `camelCase.utils.ts` | `date.utils.ts` |
| Use case file | `VerbPascalCase.ts` | `GetProducts.ts` |
| Constant | `SCREAMING_SNAKE_CASE` | `QUERY_KEYS` |

---

## References

- SKILL.md: Naming overview
- `rules/struct-feature-anatomy.md`: File locations
- `rules/feature-index-contract.md`: Export naming
