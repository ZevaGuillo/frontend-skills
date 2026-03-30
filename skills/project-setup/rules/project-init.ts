// Project Init — LOAD: when initializing new project
// ~20 lines → ~400 bytes

export const PROJECT_STRUCTURE = {
  src: {
    features: {},           // Feature modules
    shared: {               // Shared utilities
      lib: {},             // Utilities
      components: {},       // Shared UI components
      hooks: {},           // Shared hooks
    },
  },
  components: {},           // Global UI components (shadcn)
  lib: {},                  // Core utilities (axios, query-client)
  app: {},                 // App entry points (framework-specific)
} as const;

export const ROOT_FILES = [
  'package.json',
  'tsconfig.json',
  'tailwind.config.js',
  'next.config.js',       // or vite.config.ts
  '.eslintrc.json',
  '.gitignore',
];
