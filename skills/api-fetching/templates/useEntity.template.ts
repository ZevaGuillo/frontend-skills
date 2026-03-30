/**
 * Use Entity Hooks Template
 * 
 * Replace placeholders:
 * - [Entity] → Product, User, Order (PascalCase)
 * - [entity] → product, user, order (camelCase)
 * - [entities] → products, users, orders (plural)
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { 
  [entity]Repository, 
  [Entity], 
  [Entity]Filters, 
  Create[Entity]Dto, 
  Update[Entity]Dto, 
  PaginatedResponse,
  QUERY_KEYS 
} from './entity.repository';

// =============================================================================
// Query Hooks — Read operations
// =============================================================================

export function use[Entities](filters?: [Entity]Filters) {
  return useQuery({
    queryKey: QUERY_KEYS.[entities].list(filters),
    queryFn: () => [entity]Repository.get[Entities](filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function use[Entity](id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.[entities].detail(id ?? ''),
    queryFn: () => [entity]Repository.get[Entity]ById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function use[Entities]Infinite(filters?: [Entity]Filters) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.[entities].list(filters),
    queryFn: ({ pageParam = 1 }) => 
      [entity]Repository.get[Entities]({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage: PaginatedResponse<[Entity]>) => 
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
}

// =============================================================================
// Mutation Hooks — Write operations
// =============================================================================

export function useCreate[Entity]() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: Create[Entity]Dto) => [entity]Repository.create[Entity](dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.[entities].all });
    },
  });
}

export function useUpdate[Entity]() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Update[Entity]Dto }) =>
      [entity]Repository.update[Entity](id, dto),
    onMutate: async ({ id, dto }) => {
      await queryClient.cancelQueries({ 
        queryKey: QUERY_KEYS.[entities].detail(id) 
      });
      
      const previous[Entity] = queryClient.getQueryData(
        QUERY_KEYS.[entities].detail(id)
      );
      
      queryClient.setQueryData(
        QUERY_KEYS.[entities].detail(id),
        (old: [Entity] | undefined) => old ? { ...old, ...dto } : old
      );
      
      return { previous[Entity] };
    },
    onError: (_err, { id }, context) => {
      if (context?.previous[Entity]) {
        queryClient.setQueryData(
          QUERY_KEYS.[entities].detail(id),
          context.previous[Entity]
        );
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.[entities].detail(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.[entities].lists() });
    },
  });
}

export function useDelete[Entity]() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => [entity]Repository.delete[Entity](id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ 
        queryKey: QUERY_KEYS.[entities].all 
      });
      
      const previous[Entities] = queryClient.getQueriesData<[Entity]>(
        QUERY_KEYS.[entities].lists()
      );
      
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.[entities].lists() },
        (old: PaginatedResponse<[Entity]> | undefined) => 
          old ? { 
            ...old, 
            data: old.data.filter(e => e.id !== id),
            total: old.total - 1,
          } : old
      );
      
      return { previous[Entities] };
    },
    onError: (_err, _id, context) => {
      if (context?.previous[Entities]) {
        context.previous[Entities].forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.[entities].all });
    },
  });
}

export function useBulkDelete[Entities]() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ids: string[]) => [entity]Repository.bulkDelete[Entities](ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.[entities].all });
    },
  });
}

// =============================================================================
// Prefetch helpers — For Server Components / SSR
// =============================================================================

import { QueryClient } from '@tanstack/react-query';

export async function prefetch[Entities](
  queryClient: QueryClient,
  filters?: [Entity]Filters
) {
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.[entities].list(filters),
    queryFn: () => [entity]Repository.get[Entities](filters),
  });
}

export async function prefetch[Entity](
  queryClient: QueryClient,
  id: string
) {
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.[entities].detail(id),
    queryFn: () => [entity]Repository.get[Entity]ById(id),
  });
}

// =============================================================================
// Hydration helpers — For Next.js App Router
// =============================================================================

import { dehydrate } from '@tanstack/react-query';

export async function get[Entities]DehydratedState(filters?: [Entity]Filters) {
  const queryClient = new QueryClient();
  await prefetch[Entities](queryClient, filters);
  return dehydrate(queryClient);
}
