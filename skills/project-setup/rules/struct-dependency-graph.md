# Rule: Dependency Graph

> The dependency graph is unidirectional and strictly enforced. This rule defines exactly what can import from what.

## Why It Matters

- **Prevents circular dependencies** — A can't import from B if B might import from A
- **Enforces encapsulation** — Features are truly independent modules
- **Enables refactoring** — Changing Feature A never breaks Feature B
- **Makes coupling visible** — If Feature A needs Feature B, it's explicit in index.ts

---

## Dependency Direction

```
domain ← application ← infrastructure ← presentation
         (depends on)   (depends on)    (depends on)
```

**Core principle:** Dependencies flow only in one direction: inward toward presentation.

---

## Import Matrix

| From \ To | domain | application | infrastructure | presentation | shared/ | Feature B index |
|-----------|--------|-------------|---------------|-------------|---------|-----------------|
| **domain** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **application** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **infrastructure** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **presentation** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **shared/** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

**Legend:**
- ✅ = Import allowed
- ❌ = Import prohibited

---

## Feature-to-Feature Imports

### Correct: Import via index.ts

```typescript
// ✅ CORRECT: Feature A imports Feature B via its public contract
// features/orders/presentation/components/OrderProduct.tsx
import { ProductCard } from '@/features/products';  // From index.ts
import { useProducts } from '@/features/products';   // From index.ts
import type { Product } from '@/features/products';  // From index.ts
```

### Incorrect: Direct import from internal files

```typescript
// ❌ INCORRECT: Feature A imports from Feature B internal files
// features/orders/presentation/components/OrderProduct.tsx
import { ProductCard } from '@/features/products/presentation/components/ProductCard';
import { productsApi } from '@/features/products/infrastructure/api/products.api';
import { ProductRepository } from '@/features/products/infrastructure/repositories/ProductRepository';

ESLINT ERROR:
  error  '@/features/products/presentation/components/ProductCard' 
         is imported from '@/features/products' but @features/products 
         does not export it  import/no-named-as-default
```

**Why this fails:** Internal files are not guaranteed to exist. Feature B can refactor its internals without breaking consumers.

---

## Shared Folder Rules

### Correct: shared/ can be imported anywhere

```typescript
// ✅ CORRECT: Any layer can import from shared/
// features/products/application/use-cases/CreateProduct.ts
import { useAuth } from '@/shared/hooks/useAuth';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { Button } from '@/shared/components/ui/Button';
```

### Incorrect: shared/ cannot import from features

```typescript
// ❌ INCORRECT: shared/ must never depend on features
// shared/lib/auth-provider.ts
import { useUser } from '@/features/users/presentation/hooks/useUser';
import { User } from '@/features/users';

ESLINT ERROR:
  error  Dependency path reserved for shared utilities 
         cannot import from features  @nx/enforce-module-boundaries
```

**Why this fails:** If shared/ depends on features, any change in Feature A breaks every feature that uses shared/.

---

## Within-Feature Imports

### Correct: Presentation can use any layer of its own feature

```typescript
// ✅ CORRECT: Presentation layer uses hooks/api/schemas from SAME feature
// features/products/presentation/components/ProductList.tsx
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { productsApi } from '../../infrastructure/api/products.api'; // Only for type hints
import { ProductFilters } from '../../domain/types';
```

### Incorrect: Application cannot use Presentation

```typescript
// ❌ INCORRECT: Application layer must not import from Presentation
// features/products/application/use-cases/CreateProduct.ts
import { useProducts } from '../../presentation/hooks/useProducts';
import { ProductForm } from '../../presentation/components/ProductForm';

ESLINT ERROR:
  error  'presentation' is not a valid layer for application 
         to import from  @nx/enforce-module-boundaries
```

---

## ESLint Configuration

Add this to your ESLint config to enforce the dependency graph:

```javascript
// eslint.config.js or .eslintrc.json
{
  "rules": {
    "@nx/enforce-module-boundaries": [
      "error",
      {
        "depConstraints": [
          {
            "sourceTag": "*",
            "onlyDependOnLibs": ["*"]
          },
          {
            "sourceTag": "domain",
            "onlyDependOnLibs": []
          },
          {
            "sourceTag": "application",
            "onlyDependOnLibs": ["domain"]
          },
          {
            "sourceTag": "infrastructure", 
            "onlyDependOnLibs": ["domain", "application"]
          },
          {
            "sourceTag": "presentation",
            "onlyDependOnLibs": ["domain", "application", "infrastructure"]
          }
        ]
      }
    ]
  }
}
```

Or use a custom rule in `eslint.config.mjs`:

```javascript
// Alternative: Custom rule for cleaner error messages
const dependencyGraphRule = {
  meta: {
    type: 'problem',
    docs: { description: 'Enforce feature dependency graph' },
    messages: {
      invalidLayer: 'Layer "{{from}}" cannot import from "{{to}}". ' +
        'Dependency flow: domain ← application ← infrastructure ← presentation'
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        // Check import path and validate against matrix
        // ... implementation
      }
    };
  }
};
```

---

## Page/Route Layer

Pages are special: they sit between the routing layer and features.

### Correct: Pages orchestrate features

```typescript
// ✅ CORRECT: Page imports from feature index.ts
// app/products/page.tsx (Next.js)
import { ProductList } from '@/features/products';
import { getProducts } from '@/features/products/application/use-cases/GetProducts';

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductList initialData={products} />;
}
```

### Incorrect: Pages contain business logic

```typescript
// ❌ INCORRECT: Page should not contain business logic
// app/products/page.tsx
import { axios } from '@/lib/axios';

export default async function ProductsPage() {
  const { data } = await axios.get('/products'); // Business logic in page!
  return <ProductList products={data} />;
}
```

---

## Circular Dependency Prevention

### Correct: Feature A → shared/ → Feature B (explicit coupling)

```typescript
// ✅ If Feature A needs Feature B, define the dependency explicitly
// shared/lib/feature-flags.ts
export const FEATURE_FLAGS = {
  products: { enabled: true },
  orders: { enabled: true },
};

// features/products/domain/types/product.types.ts
// Can import from shared, but documents the dependency
```

### Incorrect: Feature A ↔ Feature B (circular)

```typescript
// ❌ NEVER: Circular dependencies between features
// features/products/application/use-cases/CreateProduct.ts
import { GetOrdersUseCase } from '@/features/orders/application/use-cases/GetOrders';

// features/orders/application/use-cases/GetOrders.ts  
import { GetProductsUseCase } from '@/features/products/application/use-cases/GetProducts';

ESLINT ERROR:
  error  Circular dependency detected: 
         features/products → features/orders → features/products
```

---

## Exceptions Valid

| Scenario | Treatment |
|----------|-----------|
| Two features are always used together | Consider merging into one feature |
| Feature needs a utility from Feature B | Move utility to shared/, or duplicate |
| Truly shared domain types | Move to `@/shared/domain/` |
| Cross-feature forms | Create new feature for shared forms |

---

## References

- SKILL.md: Dependency rules overview
- `rules/struct-feature-anatomy.md`: Layer definitions
- `rules/feature-index-contract.md`: How to expose feature APIs
