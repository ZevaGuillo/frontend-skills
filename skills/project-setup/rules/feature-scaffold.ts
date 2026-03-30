// Feature Scaffold — LOAD: when creating new feature
// ~30 lines → ~600 bytes

export const FEATURE_SCAFFOLD = (featureName: string) => ({
  [`features/${featureName}/`]: [
    'domain/entities',
    'domain/types',
    'domain/interfaces',
    'application/use-cases',
    'infrastructure/api',
    'infrastructure/repositories',
    'presentation/components',
    'presentation/hooks',
    'presentation/pages',
  ],
  [`features/${featureName}/index.ts`]: '// Barrel exports',
  [`features/${featureName}/README.md`]: '# Feature documentation',
});

// INDEX.TS TEMPLATE
export const INDEX_TEMPLATE = `export type { \${Entity} } from './domain/types';
export { \${Entity}List } from './presentation/components/\${Entity}List';
export { use\${Entity}s } from './presentation/hooks/use-\${entities}';
`;
