# Rule: Query Keys as Typed Constants

> Query keys must be typed constants exported from a `query-keys.ts` file. Never use magic strings scattered in components.

## Why It Matters

- **Type safety** — Renaming a query shows all usages
- **Discoverability** — QUERY_KEYS.products.list() shows all queries
- **Precise invalidation** — Invalidate QUERY_KEYS.products.all affects all product queries
- **Self-documentation** — Query keys file documents all queries

---

## Incorrect Example

```typescript
// ❌ Magic strings scattered — DON'T DO THIS
function UserProfile({ userId }: { userId: string }) {
  const { data } = useQuery({
    queryKey: ['user', userId], // Magic string
    queryFn: () => fetchUser(userId),
  });
}

function UserSettings({ userId }: { userId: string }) {
  const { data } = useQuery({
    queryKey: ['user', userId], // Same magic string, easy to break
    queryFn: () => fetchUser(userId),
  });
}

// Correct invalidation is almost impossible
queryClient.invalidateQueries({ queryKey: ['user'] }); // Too broad
```

**Problems:**
- Renaming 'user' requires finding ALL usages
- No way to know what queries exist
- Easy typo = cache miss = bugs
- Imprecise invalidation

---

## Correct Example

```typescript
// ✅ repositories/query-keys.ts
import { QueryKey } from '@tanstack/react-query';

const createQueryKey = <T extends unknown[]>(...keys: T): QueryKey => keys;

export const QUERY_KEYS = {
  users: {
    all: createQueryKey('users'),
    lists: () => createQueryKey('users', 'list'),
    list: (filters?: UserFilters) => 
      createQueryKey('users', 'list', filters),
    details: () => createQueryKey('users', 'detail'),
    detail: (id: string) => 
      createQueryKey('users', 'detail', id),
  },
  products: {
    all: createQueryKey('products'),
    lists: () => createQueryKey('products', 'list'),
    list: (filters?: ProductFilters) => 
      createQueryKey('products', 'list', filters),
    detail: (id: string) => 
      createQueryKey('products', 'detail', id),
  },
} as const;

// Type helpers for consumers
export type UserQueryKey = typeof QUERY_KEYS.users.detail;
export type ProductListQueryKey = typeof QUERY_KEYS.products.list;
```

```typescript
// ✅ hooks/use-user.ts — Correct usage
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/repositories/query-keys';
import { usersRepository } from '@/repositories/users.repository';

export function useUser(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.users.detail(id),
    queryFn: () => usersRepository.getUserById(id),
    enabled: !!id,
  });
}
```

```typescript
// ✅ Precise invalidation
const queryClient = useQueryClient();

function onUserUpdate() {
  // Invalidate ALL user queries (list, detail, etc.)
  queryClient.invalidateQueries({ 
    queryKey: QUERY_KEYS.users.all 
  });
  
  // Or only the specific filtered list
  queryClient.invalidateQueries({ 
    queryKey: QUERY_KEYS.users.list({ active: true }) 
  });
}
```

---

## Key Structure

```
QUERY_KEYS
├── [entity]
│   ├── all         → ['entity'] (invalidate everything)
│   ├── lists        → ['entity', 'list'] (all lists)
│   ├── list(filters) → ['entity', 'list', filters] (specific list)
│   ├── details      → ['entity', 'detail'] (all details)
│   └── detail(id)   → ['entity', 'detail', id] (specific detail)
```

---

## Complex Filters

For complex filter objects, serialize:

```typescript
list: (filters?: ProductFilters) => 
  createQueryKey('products', 'list', filters ? JSON.stringify(filters) : undefined),
```

---

## Exceptions Valid

| Scenario | Treatment |
|----------|-----------|
| Pagination | Include `page` and `limit` in key: `['users', 'list', { page, limit }]` |
| No parameters | Use function without args: `QUERY_KEYS.users.all` |
| Prefetching on server | Create keys without accessing QueryClient |

---

## References

- SKILL.md: Query keys overview
- `rules/three-layer-pattern.md`: Layer architecture
- `templates/query-keys.template.ts`: Template
