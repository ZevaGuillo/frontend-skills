# Rule: Next.js SSR with TanStack Query

> Adapt the three-layer pattern to Next.js App Router using Server Components for prefetching and HydrationBoundary for client hydration.

## Why It Matters

- **SEO** — Server Components render on server for crawlers
- **Performance** — Reduce client bundle and waterfalls
- **UX** — Immediate data without loading spinners
- **Consistency** — Same three-layer pattern, different entry point

---

## Server Component: Prefetching

```typescript
// app/products/page.tsx
import { QueryClient } from '@tanstack/react-query';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ProductList } from '@/features/products';
import { prefetchProducts } from '@/features/products/presentation/hooks/use-products';

export default async function ProductsPage() {
  const queryClient = new QueryClient();
  
  await prefetchProducts(queryClient);
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductList />
    </HydrationBoundary>
  );
}
```

---

## Hook: Prefetch Function

```typescript
// features/products/presentation/hooks/use-products.ts
import { useQuery, useInfiniteQuery, UseQueryOptions } from '@tanstack/react-query';
import { productsRepository } from '@/features/products/infrastructure/repositories/ProductRepository';
import { QUERY_KEYS } from '@/features/products/domain/types';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.products.list(filters),
    queryFn: () => productsRepository.getProducts(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductsInfinite(filters?: ProductFilters) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.products.list(filters),
    queryFn: ({ pageParam = 1 }) => 
      productsRepository.getProducts({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
}

// Prefetch function for Server Components
export async function prefetchProducts(
  queryClient: QueryClient,
  filters?: ProductFilters
) {
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.products.list(filters),
    queryFn: () => productsRepository.getProducts(filters),
  });
}

// Prefetch for infinite query
export async function prefetchProductsInfinite(
  queryClient: QueryClient,
  filters?: ProductFilters
) {
  await queryClient.prefetchInfiniteQuery({
    queryKey: QUERY_KEYS.products.list(filters),
    queryFn: ({ pageParam = 1 }) => 
      productsRepository.getProducts({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
}
```

---

## Dynamic Route with Params

```typescript
// app/products/[id]/page.tsx
import { QueryClient } from '@tanstack/react-query';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ProductDetail } from '@/features/products';
import { notFound } from 'next/navigation';
import { prefetchProduct } from '@/features/products/presentation/hooks/use-product';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
  
  await prefetchProduct(queryClient, id);
  
  const state = dehydrate(queryClient);
  
  // Check if product exists in dehydrated state
  if (!state.queries[0]?.state.data) {
    notFound();
  }
  
  return (
    <HydrationBoundary state={state}>
      <ProductDetail />
    </HydrationBoundary>
  );
}
```

```typescript
// Prefetch function for single product
export async function prefetchProduct(
  queryClient: QueryClient,
  id: string
) {
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.products.detail(id),
    queryFn: () => productsRepository.getProductById(id),
  });
}
```

---

## Server Actions for Mutations

```typescript
// features/products/application/actions/create-product.ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { CreateProductUseCase } from '../use-cases/CreateProduct';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';

const createProductUseCase = new CreateProductUseCase(new ProductRepository());

export async function createProduct(formData: FormData) {
  const dto = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    category: formData.get('category') as string,
  };
  
  const product = await createProductUseCase.execute(dto);
  
  // Revalidate the products page
  revalidatePath('/products');
  
  redirect(`/products/${product.id}`);
}
```

---

## Client Component with Mutations

```typescript
// features/products/presentation/components/ProductForm.tsx
'use client';

import { useCreateProduct } from '@/features/products/presentation/hooks/use-create-product';

export function ProductForm() {
  const createProduct = useCreateProduct();
  
  const handleSubmit = async (data: CreateProductDto) => {
    await createProduct.mutateAsync(data);
    // Redirect handled by Server Action or router
  };
  
  return (
    <Form onSubmit={handleSubmit} isLoading={createProduct.isPending} />
  );
}
```

---

## With Search Params

```typescript
// app/products/page.tsx
interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const queryClient = new QueryClient();
  
  await prefetchProducts(queryClient, {
    category: params.category,
    page: params.page ? parseInt(params.page) : 1,
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductList />
    </HydrationBoundary>
  );
}
```

---

## Error Handling

```typescript
// app/products/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## Loading State

```typescript
// app/products/loading.tsx
export default function Loading() {
  return <Skeleton className="h-96" />;
}
```

---

## References

- SKILL.md: SSR overview
- `rules/three-layer-pattern.md`: Layer architecture
- `templates/useEntity.template.ts`: Complete hook template
