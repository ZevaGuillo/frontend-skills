// Next.js SSR — LOAD: when using Next.js
// ~25 lines → ~500 bytes

export const NEXTJS_SSR = `
// SERVER COMPONENT (page.tsx)
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';

export default async function Page({ params }) {
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: QUERY_KEYS.products.detail(params.id),
    queryFn: () => productRepository.getProductById(params.id),
  });
  
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ProductDetail />
    </HydrationBoundary>
  );
}

// PREFETCH HELPER
export async function prefetchProduct(qc: QueryClient, id: string) {
  await qc.prefetchQuery({
    queryKey: QUERY_KEYS.products.detail(id),
    queryFn: () => productRepository.getProductById(id),
  });
}

// SERVER ACTION
'use server';
export async function createProduct(formData: FormData) {
  await productRepository.createProduct(dto);
  revalidatePath('/products');
}
`;
