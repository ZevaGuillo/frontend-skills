// TanStack Start Adapter — LOAD: when using TanStack Start
// ~20 lines → ~400 bytes

export const TANSTACK_STRUCTURE = {
  routes: {
    '': ['index.tsx'],                    // /products
    '$id': ['index.tsx'],                // /products/:id
  },
  FEATURE_INTEGRATION: {
    'routes/products.index.tsx': `import { createFileRoute } from '@tanstack/react-router';
import { ProductList } from '@/features/products';

export const Route = createFileRoute('/products/')({
  component: ProductsPage,
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ['products'],
      queryFn: () => productRepository.findAll(),
    });
  },
});

function ProductsPage() {
  const { data } = useProducts();
  return <ProductList initialData={data} />;
}`,
  },
  ACTIONS: 'features/[feature]/application/actions/',
} as const;
