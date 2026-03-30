---
name: api-fetching
description: Implements data fetching following a three-layer pattern (api → repository → hook) with TanStack Query. Use this skill when writing any data fetching code, creating API calls, defining query hooks, or implementing mutations with optimistic updates.
license: MIT
---

# Skill: api-fetching

> Three-layer pattern (api → repository → hook) with TanStack Query v5 for React applications.

## When to Apply

Activate this skill when:

- Writing any data fetching code
- Creating API calls (REST or GraphQL)
- Defining query hooks with TanStack Query
- Implementing mutations with optimistic updates
- Setting up SSR with Next.js App Router
- Configuring error handling for API calls

## Quick Reference

- `[PATTERN]` Three-layer: api → repository → hook
- `[MUST]` Query keys as typed constants in `QUERY_KEYS`
- `[NEVER]` Use `useQuery` or `useMutation` directly in components
- `[MUST]` Error handling in three levels: QueryClient, repository, hook
- `[PREFERRED]` Optimistic updates for mutations
- `[MUST]` Invalidate related queries after mutations
- `[PATTERN]` Adapt to Next.js Server Components with HydrationBoundary
- `[MUST]` Share types between layers via `types.ts`

## Rules

| Priority | Rule | Impact | Reference File |
|----------|------|--------|-----------------|
| 1 | Three-layer architecture | High | `rules/three-layer-pattern.md` |
| 2 | Query keys as typed constants | High | `rules/query-keys.md` |
| 3 | Never use useQuery directly in components | High | `rules/no-use-query-directly.md` |
| 4 | Error handling in three levels | High | `rules/error-handling.md` |
| 5 | Optimistic updates for mutations | Medium | `rules/optimistic-updates.md` |
| 6 | Query invalidation after mutations | High | `rules/query-invalidation.md` |
| 7 | Next.js SSR adaptation | Medium | `rules/nextjs-ssr.md` |
| 8 | Shared types between layers | High | `rules/shared-types.md` |

## Detail by Category

### Three-Layer Architecture

```
api/           → HTTP calls only (axios/fetch)
repository/    → Business logic, data transformation
hook/          → useQuery/useMutation, UI state
```

**Each layer has one responsibility.** The api layer only handles HTTP. The repository layer handles business logic and transforms data. The hook layer integrates with TanStack Query.

### Query Keys

Query keys must be:

- **Typed constants** — No magic strings scattered in components
- **Escapable** — Include variables in the array
- **Consistent** — Same format across all entities

### Error Handling

Errors must be handled at three levels:

| Level | Location | Purpose |
|-------|----------|---------|
| Global | QueryClient | Retry, logging, defaults |
| Domain | Repository | Specific errors (401→logout, 404→not found) |
| Presentation | Hook/Component | isError state, user message |

### Optimistic Updates

For better UX, mutations should:

- Cancel outgoing queries
- Snapshot previous state
- Update cache immediately
- Rollback on error
- Invalidate related queries on success

### Next.js SSR

For Server Components:

- Use `queryClient.prefetchQuery` to load data
- Wrap with `HydrationBoundary` passing `dehydratedState`
- Use Server Actions for mutations

---

## Templates

- `templates/entity.repository.ts` — Complete repository with CRUD
- `templates/useEntity.template.ts` — Hooks with query + mutation + infinite
- `templates/query-keys.template.ts` — Query keys pattern
- `templates/query-client.template.ts` — QueryClient configuration

## Example Structure

```
src/
├── api/
│   └── products.api.ts       // axios.get('/products')
├── repositories/
│   ├── products.repository.ts // Business logic
│   └── query-keys.ts         // QUERY_KEYS constants
├── hooks/
│   ├── use-products.ts       // useQuery hooks
│   └── use-create-product.ts  // useMutation hooks
└── components/
    └── ProductList.tsx        // Uses hooks only
```

## Anti-Patterns

- ❌ Using `useQuery` directly in components
- ❌ Magic strings as query keys
- ❌ No error handling
- ❌ Direct API calls in components
- ❌ No invalidation after mutations
- ❌ Duplicating types between layers
