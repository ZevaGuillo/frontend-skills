# Skill: project-setup

> Screaming architecture by feature: folder structure, dependency graph, and public contracts.

## When to Apply

Activate this skill when the user types or requests any of these:

- "set up a new project" / "initialize a project"
- "create a new feature" / "add feature"
- "what's the project structure?" / "how is the code organized?"
- "refactor to feature-based architecture"
- "create a module for X"
- Any request that involves creating new source code files in `src/`

## Quick Reference

- `[struct-feature]` Every feature lives in `src/features/[feature-name]/`
- `[struct-feature]` Four layers: domain → application → infrastructure → presentation
- `[struct-feature]` Maximum 200 lines per file; split if exceeded
- `[feature-contract]` Every feature exports via `index.ts` — never import from internal files
- `[feature-contract]` Barrel exports only: re-export from submodules, no implementation
- `[dependency]` Feature A cannot import from Feature B internal files
- `[dependency]` `shared/` contains max 20% of total code; if exceeded, features are poorly scoped
- `[docs]` Every feature has `README.md` regenerated on every modification
- `[framework]` Feature structure is identical across Next.js, TanStack Start, Vite SPA — only routing layer differs
- `[naming]` Folders: `kebab-case` plural, Files: `PascalCase.tsx` for components, `camelCase.ts` for others

## Rules

| Priority | Rule | Impact | Reference File |
|----------|------|--------|-----------------|
| 1 | Anatomy of feature folder | High | `rules/struct-feature-anatomy.md` |
| 2 | Dependency graph (what can import what) | High | `rules/struct-dependency-graph.md` |
| 3 | Feature `index.ts` as public contract | High | `rules/feature-index-contract.md` |
| 4 | Framework-specific adapters (Next.js, TanStack Start, Vite) | Medium | `rules/struct-framework-adapters.md` |
| 5 | Feature `README.md` auto-generation | Medium | `rules/docs-feature-readme.md` |
| 6 | Naming conventions | Medium | `rules/naming-conventions.md` |
| 7 | Page components only orchestrate | Medium | Implicit from anatomy |
| 8 | Shared folder limits (20% rule) | Low | Implicit from dependency rules |

## Detail by Category

### Feature Anatomy

A feature is a self-contained module with four layers:

```
src/features/[feature-name]/
├── domain/           # Pure types, entities, interfaces — no dependencies
├── application/      # Use cases, business logic orchestration
├── infrastructure/   # API calls, repository implementations, external services
└── presentation/     # React components, hooks, page compositions
```

**Key principle:** Each layer has a single responsibility. The domain layer has zero imports to other project code. Application layer depends only on domain. Infrastructure depends on application + domain. Presentation depends on all three.

**Reference:** `rules/struct-feature-anatomy.md`

### Dependency Graph

The dependency graph is unidirectional and strictly enforced:

```
domain ← application ← infrastructure ← presentation
         (depends on)   (depends on)    (depends on)
```

**Critical rules:**
- Feature A never imports from Feature B internal files — only from Feature B's `index.ts`
- `shared/` can be imported by anything
- `shared/` never imports from any feature
- Components in presentation layer can only use hooks/api/schemas from the same feature

**Reference:** `rules/struct-dependency-graph.md`

### Feature Contract

Every feature exposes a public API via `index.ts`:

```typescript
// features/products/index.ts
export type { Product, CreateProductDto, ProductFilters } from './domain/types';
export { CreateProductUseCase } from './application/use-cases/CreateProduct';
export { ProductRepository } from './infrastructure/repositories/ProductRepository';
export { ProductList, ProductCard, ProductForm } from './presentation/components';
export { useProducts, useCreateProduct } from './presentation/hooks';
```

**What to export:** Entry components, public types, integration hooks
**What NOT to export:** Internal utilities, Zod schemas, implementation details

**Reference:** `rules/feature-index-contract.md`

### Framework Adapters

The internal feature structure is identical across frameworks. Only the routing layer differs:

| Aspect | Next.js App Router | TanStack Start | Vite SPA |
|--------|-------------------|----------------|----------|
| Route definition | `app/` folder | `routes/` config | React Router v7 |
| Page component | Server Component in `app/` | Route component | Page in `pages/` |
| Data loading | Server Components + prefetch | Loaders | useEffect/fetch |
| Mutations | Server Actions | Actions | Form handlers |

**Reference:** `rules/struct-framework-adapters.md`

### Auto-Generated Documentation

Every feature must have a `README.md` that the agent regenerates on every modification:

```markdown
# Feature: [name]

## Purpose
[2 sentences describing what this feature does]

## Public API (from index.ts)
- `useProducts()` — hook for fetching product list
- `ProductList` — main list component

## Dependencies
- External: `@tanstack/react-query`, `@/lib/axios`
- Internal (via shared): `useAuth` from `@/shared/auth`

## File Map
| File | Purpose |
|------|---------|
| `domain/types.ts` | Product entity and DTOs |
| `application/use-cases/` | Business logic |
```

**Reference:** `rules/docs-feature-readme.md`

### Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Feature folder | `kebab-case` plural | `products/`, `user-settings/` |
| Components | `PascalCase.tsx` | `ProductList.tsx`, `UserCard.tsx` |
| Hooks | `useCamelCase.ts` | `useProducts.ts`, `useAuth.ts` |
| Repositories | `camelCase.repository.ts` | `products.repository.ts` |
| Schemas | `camelCase.schema.ts` | `products.schema.ts` |
| Types | `camelCase.types.ts` | `products.types.ts` |
| Utilities | `camelCase.utils.ts` | `date.utils.ts` |
| Query keys | `SCREAMING_SNAKE_CASE` | `QUERY_KEYS` |

**Reference:** `rules/naming-conventions.md`

## Templates

Use these templates to create new features:

- `templates/feature-index.template.ts` — Complete `index.ts` with typed exports
- `templates/feature-readme.template.md` — Auto-generated README template
- `templates/feature-types.template.ts` — Domain types pattern
- `templates/feature-schema.template.ts` — Zod schemas pattern

## Principles

These skills enforce (in priority order):

1. **SOLID** — Each file has one reason to change
2. **KISS** — Simplest structure that solves the problem
3. **YAGNI** — Don't create abstractions until 3 real cases justify them
4. **DRY with judgment** — Duplicate is fine up to 2 times; abstract on the third

## Anti-Patterns

- ❌ Importing `products/api/products.api.ts` from another feature
- ❌ Putting business logic in page components
- ❌ Having a `shared/utils/` folder with 50+ files
- ❌ Exporting Zod schemas from feature `index.ts`
- ❌ Page components making direct API calls
- ❌ Features importing from `shared/lib/` that depends on another feature
