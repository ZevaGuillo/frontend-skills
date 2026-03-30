# Rule: Framework-Specific Adapters

> The internal feature structure is identical across Next.js App Router, TanStack Start, and Vite SPA. Only the routing layer differs. This rule documents the specific differences.

## Why It Matters

- **Framework agnosticism** — Features don't know which framework is used
- **Migration path** — Moving from one framework to another only changes routing layer
- **Team flexibility** — Different teams can use different frameworks with same feature code
- **Consistency** — Same patterns regardless of underlying framework

---

## Comparison Matrix

| Aspect | Next.js App Router | TanStack Start | Vite SPA |
|--------|-------------------|----------------|----------|
| Route definition | `app/` folder | `routes/` config | `pages/` or `App.tsx` |
| Data fetching | Server Components + prefetch | Loaders | useEffect/fetch |
| Mutations | Server Actions | Actions | Form handlers |
| Route params | `params` prop | Loader args | `useParams` hook |
| Search params | `searchParams` prop | URL search | `useSearchParams` |
| Client/Server split | `'use client'` directive | Auto-detected | Client-only |

---

## Next.js App Router

### Directory Structure

```
src/
├── app/                           # Next.js App Router
│   ├── products/
│   │   ├── page.tsx              # Server Component (default)
│   │   ├── [id]/
│   │   │   └── page.tsx          # Dynamic route
│   │   ├── loading.tsx           # Loading state
│   │   ├── error.tsx              # Error boundary
│   │   └── layout.tsx             # Route-specific layout
│   └── layout.tsx                # Root layout
├── features/
│   └── products/                 # Feature (identical structure)
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
└── shared/
```

### Page: Server Component Pattern

```typescript
// app/products/page.tsx
import { ProductList } from '@/features/products';
import { getProducts } from '@/features/products/application/use-cases/GetProducts';

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductList initialData={products} />;
}
```

### Page: With Search Params

```typescript
// app/products/page.tsx
import { ProductList } from '@/features/products';
import { getProducts } from '@/features/products/application/use-cases/GetProducts';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const products = await getProducts({
    category: params.category,
    page: params.page ? parseInt(params.page) : 1,
    sortBy: params.sort as 'name' | 'price' | 'createdAt',
  });
  return <ProductList initialData={products} />;
}
```

### Page: Dynamic Route with Params

```typescript
// app/products/[id]/page.tsx
import { ProductDetail } from '@/features/products';
import { getProductById } from '@/features/products/application/use-cases/GetProductById';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetail product={product} />;
}
```

### Client Component: Feature Hook

```typescript
// features/products/presentation/hooks/use-products.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { QUERY_KEYS } from '../../domain/types';

const productRepository = new ProductRepository();

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.products.list(filters),
    queryFn: () => productRepository.findAll(filters),
  });
}
```

### Server Action: Mutation

```typescript
// features/products/application/actions/create-product.ts
'use server';

import { redirect } from 'next/navigation';
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
  redirect(`/products/${product.id}`);
}
```

### Prefetch in Server Component

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

## TanStack Start

### Directory Structure

```
src/
├── routes/
│   ├── products.index.tsx        # Route: /products
│   ├── products.$id.tsx          # Route: /products/:id
│   └── products.tsx             # Layout: /products/*
├── features/
│   └── products/                # Feature (identical structure)
└── shared/
```

### Route: List Page

```typescript
// routes/products.index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ProductList } from '@/features/products';
import { useProducts } from '@/features/products/presentation/hooks/use-products';

export const Route = createFileRoute('/products/')({
  component: ProductsPage,
  loader: async ({ context }) => {
    // Use context.queryClient for SSR, or fetch directly
    return context.queryClient.ensureQueryData({
      queryKey: QUERY_KEYS.products.list(),
      queryFn: () => productRepository.findAll(),
    });
  },
});

function ProductsPage() {
  const { data } = useProducts();
  return <ProductList initialData={data} />;
}
```

### Route: Dynamic Route

```typescript
// routes/products.$id.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ProductDetail } from '@/features/products';

export const Route = createFileRoute('/products/$id')({
  component: ProductPage,
  loader: async ({ params }) => {
    return productRepository.findById(params.id);
  },
});

function ProductPage() {
  const product = Route.useLoaderData();
  return <ProductDetail product={product} />;
}
```

### Action: Mutation

```typescript
// features/products/application/actions/create-product.ts
import { createProductUseCase } from '../use-cases/CreateProduct';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { router } from '@/app/router';

const createProductUseCase = new CreateProductUseCase(new ProductRepository());

export async function createProductAction(data: CreateProductDto) {
  const product = await createProductUseCase.execute(data);
  router.navigate({ to: '/products/$id', params: { id: product.id } });
}
```

---

## Vite SPA (React Router v7)

### Directory Structure

```
src/
├── pages/
│   ├── ProductsPage.tsx         # Route: /products
│   ├── ProductDetailPage.tsx   # Route: /products/:id
│   └── ProductEditPage.tsx     # Route: /products/:id/edit
├── App.tsx                      # Router configuration
├── main.tsx                     # Entry point
├── features/
│   └── products/                # Feature (identical structure)
└── shared/
```

### Page: List Component

```typescript
// pages/ProductsPage.tsx
import { ProductList } from '@/features/products';
import { useProducts } from '@/features/products/presentation/hooks/use-products';

export function ProductsPage() {
  const { data, isLoading, error } = useProducts();
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ProductList initialData={data} />;
}
```

### Page: Dynamic Route

```typescript
// pages/ProductDetailPage.tsx
import { useParams } from 'react-router-dom';
import { ProductDetail } from '@/features/products';
import { useProduct } from '@/features/products/presentation/hooks/use-product';

export function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id!);
  
  if (isLoading) return <Spinner />;
  if (!product) return <NotFound />;
  
  return <ProductDetail product={product} />;
}
```

### Form Handler: Mutation

```typescript
// pages/ProductEditPage.tsx
import { useNavigate } from 'react-router-dom';
import { ProductForm } from '@/features/products';
import { useUpdateProduct } from '@/features/products/presentation/hooks/use-update-product';

export function ProductEditPage() {
  const navigate = useNavigate();
  const updateProduct = useUpdateProduct();
  
  const handleSubmit = async (data: UpdateProductDto) => {
    await updateProduct.mutateAsync({ id, dto: data });
    navigate(`/products/${id}`);
  };
  
  return <ProductForm onSubmit={handleSubmit} />;
}
```

---

## Shared Pattern: Feature Presentation

In all three frameworks, the presentation layer is identical:

```typescript
// features/products/presentation/components/ProductList.tsx
// This component is the SAME across all frameworks

import { useProducts } from '../hooks/use-products';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  initialData?: PaginatedResponse<Product>;
}

export function ProductList({ initialData }: ProductListProps) {
  const { data = initialData, isLoading } = useProducts();
  
  if (isLoading) return <Skeleton />;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## Decision Guide

| Scenario | Framework | Approach |
|----------|-----------|----------|
| SEO-critical pages | Next.js | Server Components |
| Highly interactive dashboard | Any | Client components + hooks |
| Static pages | Next.js | Static generation |
| Complex routing | TanStack Start | File-based routes |
| Simple SPA | Vite | React Router v7 |
| SSR required | Next.js | App Router |
| Client-only | Any | All client components |

---

## Exceptions Valid

| Scenario | Treatment |
|----------|-----------|
| Server Actions needed only | TanStack Start with actions, no loaders |
| Static export needed | Vite with prerender, or Next.js static |
| Edge runtime | Next.js only |
| Complex state management | TanStack Start with router state |

---

## References

- SKILL.md: Framework adapter overview
- `rules/struct-feature-anatomy.md`: Layer definitions
- `rules/feature-index-contract.md`: Feature exports
