/**
 * Feature Public Contract Template
 * 
 * Replace all placeholders:
 * - [Entity] → Product, User, Order, etc. (PascalCase singular)
 * - [entity] → product, user, order, etc. (camelCase singular)
 * - [entities] → products, users, orders, etc. (camelCase plural)
 * 
 * This template exports the public API of the feature.
 * Only export what consumers need: components, hooks, and types.
 */

// =============================================================================
// Domain Types — Public types consumers need
// =============================================================================
export type {
  [Entity],
  Create[Entity]Dto,
  Update[Entity]Dto,
  [Entity]Filters,
  PaginatedResponse,
} from './domain/types/[entity].types';

// =============================================================================
// Application Use Cases — Business logic exposed as functions
// =============================================================================
// Uncomment use cases that are consumed externally
// export { Get[Entities]UseCase } from './application/use-cases/Get[Entities]';
// export { Get[Entity]ByIdUseCase } from './application/use-cases/Get[Entity]ById';
// export { Create[Entity]UseCase } from './application/use-cases/Create[Entity]';
// export { Update[Entity]UseCase } from './application/use-cases/Update[Entity]';
// export { Delete[Entity]UseCase } from './application/use-cases/Delete[Entity]';

// =============================================================================
// Presentation Components — Entry point components for UI
// =============================================================================
// Uncomment components that are part of the public API
// export { [Entity]List } from './presentation/components/[Entity]List';
// export { [Entity]Card } from './presentation/components/[Entity]Card';
// export { [Entity]Form } from './presentation/components/[Entity]Form';
// export { [Entity]Detail } from './presentation/components/[Entity]Detail';
// export { [Entity]Table } from './presentation/components/[Entity]Table';
// export { [Entity]FiltersPanel } from './presentation/components/[Entity]FiltersPanel';

// Export prop types for components
// export type { [Entity]ListProps } from './presentation/components/[Entity]List';
// export type { [Entity]CardProps } from './presentation/components/[Entity]Card';
// export type { [Entity]FormProps } from './presentation/components/[Entity]Form';
// export type { [Entity]DetailProps } from './presentation/components/[Entity]Detail';
// export type { [Entity]TableProps } from './presentation/components/[Entity]Table';

// =============================================================================
// Presentation Hooks — Integration hooks for components
// =============================================================================
// Uncomment hooks that are part of the public API
// export { use[Entities] } from './presentation/hooks/use-[entities]';
// export { use[Entity] } from './presentation/hooks/use-[entity]';
// export { useCreate[Entity] } from './presentation/hooks/use-create-[entity]';
// export { useUpdate[Entity] } from './presentation/hooks/use-update-[entity]';
// export { useDelete[Entity] } from './presentation/hooks/use-delete-[entity]';
// export { use[Entities]Infinite } from './presentation/hooks/use-[entities]-infinite';

// =============================================================================
// Page Components — Route handlers (if applicable)
// =============================================================================
// Uncomment pages that are part of the public API
// export { [Entities]Page } from './presentation/pages/[Entities]Page';
// export { [Entity]DetailPage } from './presentation/pages/[Entity]DetailPage';
// export { [Entity]EditPage } from './presentation/pages/[Entity]EditPage';
