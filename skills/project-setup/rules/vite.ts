// Vite SPA Adapter — LOAD: when using Vite
// ~20 lines → ~400 bytes

export const VITE_STRUCTURE = {
  src: {
    pages: {},            // Route components
    App: 'tsx',          // Router configuration
    main: 'tsx',         // Entry point
  },
  FEATURE_INTEGRATION: {
    'pages/ProductsPage.tsx': `import { ProductList } from '@/features/products';
import { useProducts } from '@/features/products/presentation/hooks/use-products';

export function ProductsPage() {
  const { data } = useProducts();
  return <ProductList initialData={data} />;
}`,
  },
  ROUTER: 'react-router-dom v7',
} as const;
