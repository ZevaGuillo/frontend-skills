/**
 * Entity Repository Template
 * 
 * Replace placeholders:
 * - [Entity] → Product, User, Order (PascalCase)
 * - [entity] → product, user, order (camelCase)
 * - [entities] → products, users, orders (plural)
 */

import { axios } from '@/lib/axios';

// =============================================================================
// Types — Shared between all layers
// =============================================================================

export interface [Entity] {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Create[Entity]Dto {
  name: string;
  description?: string;
}

export interface Update[Entity]Dto extends Partial<Create[Entity]Dto> {
  isActive?: boolean;
}

export interface [Entity]Filters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: keyof [Entity];
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// =============================================================================
// API Layer — Pure HTTP calls
// =============================================================================

const [entity]Api = {
  getAll: (params?: [Entity]Filters) =>
    axios.get<PaginatedResponse<[Entity]>>('/[entities]', { params }),

  getById: (id: string) =>
    axios.get<[Entity]>(`/[entities]/${id}`),

  create: (data: Create[Entity]Dto) =>
    axios.post<[Entity]>('/[entities]', data),

  update: (id: string, data: Update[Entity]Dto) =>
    axios.patch<[Entity]>(`/[entities]/${id}`, data),

  delete: (id: string) =>
    axios.delete(`/[entities]/${id}`),

  bulkDelete: (ids: string[]) =>
    axios.delete('/[entities]/bulk', { data: { ids } }),
};

// =============================================================================
// Repository Layer — Business logic
// =============================================================================

export const [entity]Repository = {
  get[Entities]: async (filters?: [Entity]Filters): Promise<PaginatedResponse<[Entity]>> => {
    const { data } = await [entity]Api.getAll(filters);
    return data;
  },

  get[Entity]ById: async (id: string): Promise<[Entity]> => {
    const { data } = await [entity]Api.getById(id);
    return data;
  },

  create[Entity]: async (dto: Create[Entity]Dto): Promise<[Entity]> => {
    const { data } = await [entity]Api.create(dto);
    return data;
  },

  update[Entity]: async (id: string, dto: Update[Entity]Dto): Promise<[Entity]> => {
    const { data } = await [entity]Api.update(id, dto);
    return data;
  },

  delete[Entity]: async (id: string): Promise<void> => {
    await [entity]Api.delete(id);
  },

  bulkDelete[Entities]: async (ids: string[]): Promise<void> => {
    await [entity]Api.bulkDelete(ids);
  },
};
