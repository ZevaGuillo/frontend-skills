// Next.js Adapter — LOAD: when using Next.js
// ~25 lines → ~500 bytes

export const NEXTJS_STRUCTURE = {
  app: {
    '': ['page.tsx', 'layout.tsx', 'loading.tsx', 'error.tsx', 'not-found.tsx'],
    '[id]': ['page.tsx'],  // Dynamic routes
    'api': [],              // API routes (optional)
  },
  FEATURE_INTEGRATION: {
    'app/products/page.tsx': `import { ProductList } from '@/features/products';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

export default async function Page() {
  const qc = new QueryClient();
  await qc.prefetchQuery({ queryKey: ['products'], queryFn: fetchProducts });
  return <HydrationBoundary state={dehydrate(qc)}><ProductList /></HydrationBoundary>;
}`,
  },
  SERVER_ACTIONS: 'features/[feature]/application/actions/',
} as const;

// KEY: Features unchanged, ONLY routing layer differs
