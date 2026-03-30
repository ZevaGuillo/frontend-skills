// Naming Conventions — LOAD: on naming questions
// ~25 lines → ~500 bytes

export const NAMING = {
  folders: {
    feature: 'kebab-case plural',        // products, user-settings
    layer: 'kebab-case',                 // domain, application
  },
  files: {
    component: 'PascalCase.tsx',         // ProductList.tsx
    hook: 'usePascalCase.ts',           // useProducts.ts
    repository: 'PascalCaseRepository.ts', // ProductRepository.ts
    schema: 'camelCase.schema.ts',        // product.schema.ts
    types: 'camelCase.types.ts',         // product.types.ts
    utils: 'camelCase.utils.ts',        // date.utils.ts
    api: 'camelCase.api.ts',             // products.api.ts
  },
  constants: 'SCREAMING_SNAKE_CASE',     // QUERY_KEYS
} as const;

// VALIDATE
// ✅ products/presentation/components/ProductList.tsx
// ❌ products/presentation/components/product-list.tsx
