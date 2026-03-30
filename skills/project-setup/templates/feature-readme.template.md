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

```typescript
import { [Export] } from '@/features/[feature-name]';

// Example code showing how to use
```

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
| [feature] | Loose coupling | [Brief reason] |

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
| `presentation/components/[Entity]Detail.tsx` | Full [entity] detail |
| `presentation/components/[Entity]Table.tsx` | Table view |
| `presentation/components/[Entity]FiltersPanel.tsx` | Filter UI |
| `presentation/hooks/use-[entities].ts` | Query hook for list |
| `presentation/hooks/use-[entity].ts` | Query hook for single |
| `presentation/hooks/use-create-[entity].ts` | Mutation hook for create |
| `presentation/hooks/use-update-[entity].ts` | Mutation hook for update |
| `presentation/hooks/use-delete-[entity].ts` | Mutation hook for delete |
| `presentation/pages/[Entities]Page.tsx` | Route page: list |
| `presentation/pages/[Entity]DetailPage.tsx` | Route page: detail |
| `presentation/pages/[Entity]EditPage.tsx` | Route page: edit |

## Architecture Notes

[Any specific architectural decisions, patterns, or considerations]

## Related Features

- [Feature name] - [Brief relationship]
- [Feature name] - [Brief relationship]

---

*This README is auto-generated. Edit the feature source files to update.*
