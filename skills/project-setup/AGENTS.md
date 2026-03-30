# project-setup — Agent Reference

> Dense reference for agents. Use this when SKILL.md + individual rules are too verbose.

---

## Feature Structure (struct-feature-anatomy)

Every feature has four layers:

```
features/[kebab-plural]/
├── domain/           # Types, entities, interfaces — ZERO deps
├── application/      # Use cases, business logic
├── infrastructure/   # API calls, repositories
└── presentation/     # React components, hooks, pages
```

**Each layer has ONE job.** Domain = pure types. Application = logic. Infrastructure = external. Presentation = UI.

---

## Dependency Graph (struct-dependency-graph)

```
domain ← application ← infrastructure ← presentation
```

| From \ To | domain | app | infra | pres | shared | Feature B |
|-----------|--------|-----|-------|------|--------|-----------|
| domain | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| application | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| infrastructure | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| presentation | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| shared | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

**Rule:** Feature A imports Feature B ONLY via Feature B's `index.ts`. Never: `import { X } from '@/features/B/presentation/components/X'`.

---

## Feature Contract (feature-index-contract)

`index.ts` exports ONLY:

- Entry components (`ProductList`, `UserCard`)
- Integration hooks (`useProducts`, `useCreateUser`)
- Public types (`Product`, `CreateUserDto`)

**Never export:** Zod schemas, repository implementations, API clients, internal utilities.

```typescript
// features/products/index.ts
export type { Product, CreateProductDto } from './domain/types';
export { ProductList } from './presentation/components/ProductList';
export { useProducts } from './presentation/hooks/use-products';
```

---

## Framework Adapters (struct-framework-adapters)

Feature internals are IDENTICAL across frameworks. Only routing differs.

| Aspect | Next.js App Router | TanStack Start | Vite SPA |
|--------|-------------------|----------------|----------|
| Route | `app/` folder | `routes/` config | `pages/` + Router |
| Page | Server Component | Route component | Page component |
| Data | `await` in page | Loader | useEffect |
| Prefetch | `HydrationBoundary` | `ensureQueryData` | None |
| Action | Server Action | Action function | Form handler |

---

## Naming (naming-conventions)

| Type | Format | Example |
|------|--------|---------|
| Feature folder | `kebab-case` plural | `products/` |
| Component | `PascalCase.tsx` | `ProductList.tsx` |
| Hook | `usePascalCase.ts` | `useProducts.ts` |
| Repository | `PascalCaseRepository.ts` | `ProductRepository.ts` |
| API | `camelCase.api.ts` | `products.api.ts` |
| Schema | `camelCase.schema.ts` | `product.schema.ts` |
| Types | `camelCase.types.ts` | `product.types.ts` |
| Utility | `camelCase.utils.ts` | `date.utils.ts` |
| Query keys | `SCREAMING_SNAKE_CASE` | `QUERY_KEYS` |

---

## README Auto-Generation (docs-feature-readme)

Regenerate README.md on EVERY feature modification. Sections:

1. **Purpose** — 2-3 sentences (manual)
2. **Public API** — Derived from index.ts exports
3. **Dependencies** — External + internal via shared/ + feature couplings
4. **File Map** — Derived from folder structure

---

## Page Component Rule

Pages (`presentation/pages/` or `app/`) are ORCHESTRATORS ONLY. They:
- Import from feature index.ts
- Call use cases or hooks
- Pass data to presentation components

**They NEVER:** make API calls directly, contain business logic, or implement complex transformations.

---

## File Size Limit

**200 lines max per file.** Split if exceeded.

---

## Shared Folder Limit

**20% rule:** `shared/` contains max 20% of total code. If exceeded → features are poorly scoped.

---

## Quick Commands

Create new feature:
```bash
mkdir -p src/features/[feature]/{domain/{entities,types,interfaces},application/use-cases,infrastructure/{api,repositories},presentation/{components,hooks,pages}}
touch src/features/[feature]/{domain/index.ts,application/index.ts,infrastructure/index.ts,presentation/index.ts,index.ts,README.md}
```

---

## Templates

- `templates/feature-index.template.ts` → Copy to feature root as `index.ts`
- `templates/feature-readme.template.md` → Copy to feature root as `README.md`
- `templates/feature-types.template.ts` → Copy to `domain/types/[entity].types.ts`
- `templates/feature-schema.template.ts` → Copy to `infrastructure/schemas/[entity].schema.ts`

---

## Trigger Phrases

Activate this skill when user types:
- "set up a new project"
- "create a new feature"
- "what's the project structure?"
- "refactor to feature-based architecture"
- Any request involving creating source files in `src/`
