# Rule: Feature README Auto-Generation

> Every feature must have a README.md that documents what it does, what it exports, and its dependencies. The agent regenerates this file on every feature modification.

## Why It Matters

- **Self-documenting codebase** — New developers understand features without reading code
- **Dependency tracking** — Visible coupling between features
- **Contract visibility** — What the feature provides is explicit
- **Onboarding** — First thing to read when joining a feature team

---

## README Template

```markdown
# Feature: [Feature Name]

> [One-line description of what this feature does]

## Purpose

[2-3 sentences describing the feature's responsibility and domain]

## Public API

Imported from `@/features/[feature-name]`:

| Export | Type | Description |
|--------|------|-------------|
| [Component/Hook/Type] | [component/hook/type] | [What it does] |

### Usage Example

\`\`\`typescript
import { [Export] } from '@/features/[feature-name]';

// Example code showing how to use
\`\`\`

## Dependencies

### External

| Dependency | Purpose |
|------------|---------|
| @tanstack/react-query | Data fetching and caching |
| @/lib/axios | HTTP client |
| zod | Schema validation |

### Internal (via shared/)

| Module | Purpose | Usage |
|--------|---------|-------|
| @/shared/hooks/useAuth | Authentication state | User context |
| @/shared/lib/formatCurrency | Currency formatting | Price display |

### Feature Dependencies

| Feature | Dependency Type | Reason |
|---------|----------------|--------|
| orders | Loose coupling | Product selection in orders |

## File Map

### Domain Layer

| File | Purpose |
|------|---------|
| `domain/entities/[Entity].ts` | Core entity interface |
| `domain/types/[entity].types.ts` | DTOs, filters, response types |
| `domain/interfaces/I[Entity]Repository.ts` | Repository contract |

### Application Layer

| File | Purpose |
|------|---------|
| `application/use-cases/Get[Entities].ts` | Fetch [entities] list |
| `application/use-cases/Get[Entity]ById.ts` | Fetch single [entity] |
| `application/use-cases/Create[Entity].ts` | Create new [entity] |
| `application/use-cases/Update[Entity].ts` | Update [entity] |
| `application/use-cases/Delete[Entity].ts` | Delete [entity] |

### Infrastructure Layer

| File | Purpose |
|------|---------|
| `infrastructure/api/[entity].api.ts` | HTTP client for [entity] endpoints |
| `infrastructure/repositories/[Entity]Repository.ts` | Repository implementation |

### Presentation Layer

| File | Purpose |
|------|---------|
| `presentation/components/[Entity]List.tsx` | List container component |
| `presentation/components/[Entity]Card.tsx` | Single [entity] display |
| `presentation/components/[Entity]Form.tsx` | Create/edit form |
| `presentation/hooks/use-[entities].ts` | Query hooks for list |
| `presentation/hooks/use-[entity].ts` | Query hook for single |
| `presentation/hooks/use-create-[entity].ts` | Mutation hook for create |
| `presentation/pages/[Entity]Page.tsx` | Route page component |

## Architecture Notes

[Any specific architectural decisions, patterns, or considerations]

## Related Features

- [Feature name] - [Brief relationship]
- [Feature name] - [Brief relationship]

---

*This README is auto-generated. Edit the feature source files to update.*
```

---

## Auto-Generation Logic

The agent regenerates README.md when:

1. **Feature created** — Generate initial README
2. **New component added** — Update Public API and File Map
3. **New dependency added** — Update Dependencies section
4. **Component removed** — Remove from Public API and File Map

### Generation Script (Agent Logic)

```typescript
// Agent implements this logic to regenerate README
interface FeatureReadmeConfig {
  featureName: string;
  domain: {
    entities: string[];
    types: string[];
    interfaces: string[];
  };
  application: {
    useCases: string[];
  };
  infrastructure: {
    api: string[];
    repositories: string[];
  };
  presentation: {
    components: string[];
    hooks: string[];
    pages: string[];
  };
}

function generateReadme(config: FeatureReadmeConfig): string {
  // 1. Generate File Map from directory structure
  // 2. Extract Public API from index.ts exports
  // 3. Extract Dependencies from import statements
  // 4. Generate markdown
  return markdown;
}
```

---

## Example: products Feature README

```markdown
# Feature: Products

> Product catalog management

## Purpose

Manages the product catalog including product creation, listing, editing, and deletion. Handles product search, filtering, and inventory tracking. Provides UI components for displaying products in various formats (grid, table).

## Public API

Imported from `@/features/products`:

| Export | Type | Description |
|--------|------|-------------|
| ProductList | component | Main product list container |
| ProductCard | component | Single product display card |
| ProductForm | component | Create/edit product form |
| ProductDetail | component | Full product detail view |
| ProductTable | component | Table view for products |
| useProducts | hook | Query hook for product list |
| useProduct | hook | Query hook for single product |
| useCreateProduct | hook | Mutation hook for create |
| useUpdateProduct | hook | Mutation hook for update |
| useDeleteProduct | hook | Mutation hook for delete |
| Product | type | Product entity interface |
| CreateProductDto | type | Create product input |
| ProductFilters | type | Filter options for list |

### Usage Example

```typescript
import { ProductList, useProducts, type Product } from '@/features/products';

function ProductsPage() {
  const { data, isLoading } = useProducts({ category: 'electronics' });
  
  if (isLoading) return <Spinner />;
  
  return <ProductList initialData={data} />;
}
```

## Dependencies

### External

| Dependency | Purpose |
|------------|---------|
| @tanstack/react-query | Data fetching and caching |
| @/lib/axios | HTTP client |
| zod | Schema validation |
| @hookform/resolvers | Form validation |

### Internal (via shared/)

| Module | Purpose | Usage |
|--------|---------|-------|
| @/shared/hooks/useAuth | Authentication state | Admin-only actions |
| @/shared/lib/formatCurrency | Currency formatting | Price display |
| @/shared/components/ui/Button | Base button | Form buttons |

### Feature Dependencies

| Feature | Dependency Type | Reason |
|---------|----------------|--------|
| categories | Loose coupling | Product categories |
| orders | Loose coupling | Product in orders |

## File Map

### Domain Layer

| File | Purpose |
|------|---------|
| `domain/entities/Product.ts` | Core product entity |
| `domain/types/product.types.ts` | DTOs, filters, response types |
| `domain/interfaces/IProductRepository.ts` | Repository contract |

### Application Layer

| File | Purpose |
|------|---------|
| `application/use-cases/GetProducts.ts` | Fetch products list |
| `application/use-cases/GetProductById.ts` | Fetch single product |
| `application/use-cases/CreateProduct.ts` | Create new product |
| `application/use-cases/UpdateProduct.ts` | Update product |
| `application/use-cases/DeleteProduct.ts` | Delete product |

### Infrastructure Layer

| File | Purpose |
|------|---------|
| `infrastructure/api/products.api.ts` | HTTP client for products API |
| `infrastructure/repositories/ProductRepository.ts` | Repository implementation |

### Presentation Layer

| File | Purpose |
|------|---------|
| `presentation/components/ProductList.tsx` | List container component |
| `presentation/components/ProductCard.tsx` | Single product display |
| `presentation/components/ProductForm.tsx` | Create/edit form |
| `presentation/components/ProductDetail.tsx` | Full product detail |
| `presentation/components/ProductTable.tsx` | Table view |
| `presentation/components/ProductFiltersPanel.tsx` | Filter UI |
| `presentation/hooks/use-products.ts` | Query hook for list |
| `presentation/hooks/use-product.ts` | Query hook for single |
| `presentation/hooks/use-create-product.ts` | Mutation hook for create |
| `presentation/hooks/use-update-product.ts` | Mutation hook for update |
| `presentation/hooks/use-delete-product.ts` | Mutation hook for delete |
| `presentation/hooks/use-products-infinite.ts` | Infinite scroll hook |
| `presentation/pages/ProductsPage.tsx` | Route page: list |
| `presentation/pages/ProductDetailPage.tsx` | Route page: detail |
| `presentation/pages/ProductEditPage.tsx` | Route page: edit |

## Architecture Notes

- Uses optimistic updates for better UX on mutations
- Implements infinite scroll via useProductsInfinite hook
- Product images use lazy loading
- Search uses debounced API calls

## Related Features

- categories - Product categorization
- orders - Products appear in order line items

---

*This README is auto-generated. Edit the feature source files to update.*
```

---

## Sections That Are Auto-Generated

| Section | Auto-Generated | Manual Edit |
|---------|---------------|-------------|
| Public API table | ✅ | ❌ (derived from index.ts) |
| File Map | ✅ | ❌ (derived from structure) |
| Dependencies | ✅ | ⚠️ (derived + manual notes) |
| Purpose | ❌ | ✅ |
| Architecture Notes | ❌ | ✅ |
| Related Features | ❌ | ✅ |

---

## Agent Trigger

The agent regenerates README.md:

1. **On feature creation** — Generate initial README
2. **After adding/removing files** — Update File Map
3. **After modifying index.ts** — Update Public API
4. **After adding imports** — Update Dependencies

---

## References

- SKILL.md: Documentation requirements
- `rules/feature-index-contract.md`: What to export
- `templates/feature-readme.template.md`: Markdown template
