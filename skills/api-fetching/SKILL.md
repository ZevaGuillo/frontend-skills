---
name: api-fetching
description: Implements data fetching following a three-layer pattern (api → repository → hook) with TanStack Query. Use this skill when writing any data fetching code, creating API calls, defining query hooks, or implementing mutations with optimistic updates.
license: MIT
---

# api-fetching — Execution Protocol

## Phase 1: Intent Detection

### IF user says:
- "fetch data" / "API call" / "get data"
- "useQuery" / "useMutation"
- "TanStack Query" / "React Query"
- "optimistic update" / "cache invalidation"
- "server component" / "SSR" / "hydration"

→ THEN activate api-fetching skill

## Phase 2: Context Selection (LAZY LOAD)

### Required (ALWAYS):
- rules/three-layer.ts (always needed)

### Conditional (LOAD ON DEMAND):
| User Context | Load Rule |
|------------|-----------|
| Query keys | rules/query-keys.ts |
| Optimistic updates | rules/optimistic.ts |
| Cache invalidation | rules/invalidation.ts |
| Error handling | rules/errors.ts |
| Next.js SSR | rules/nextjs.ts |
| Type sharing | rules/shared-types.ts |

## Phase 3: Decision Tree

```
User Request
    │
    ├─► New API endpoint? → three-layer.ts → api → repository → hook
    │
    ├─► Query keys? → LOAD: query-keys.ts → QUERY_KEYS constants
    │
    ├─► Mutation with update? → LOAD: optimistic.ts → onMutate/onError
    │
    ├─► After mutation? → LOAD: invalidation.ts → invalidateQueries
    │
    ├─► Error handling? → LOAD: errors.ts → three-level handling
    │
    └─► Next.js SSR? → LOAD: nextjs.ts → HydrationBoundary
```

## Phase 4: Output Generation

### DO:
- Generate api → repository → hook structure
- Use QUERY_KEYS constants
- Implement optimistic updates for mutations
- Invalidate after mutations

### DON'T:
- Use useQuery directly in components
- Magic string query keys
- Skip error handling

## Quick Reference

| Pattern | Location |
|---------|----------|
| Three-layer | rules/three-layer.ts |
| Query keys | rules/query-keys.ts |
| Optimistic | rules/optimistic.ts |
| Invalidation | rules/invalidation.ts |
| Next.js SSR | rules/nextjs.ts |

## Commands

```
npx api:add [entity]      → Generate api + repository + hooks
npx api:mutation [type]  → Add CRUD mutation
```
