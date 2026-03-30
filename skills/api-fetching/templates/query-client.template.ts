/**
 * Query Client Configuration Template
 * 
 * Configures the global QueryClient with:
 * - Default retry strategy
 * - Error handling
 * - Cache settings
 * - Query invalidation defaults
 */

import { QueryClient } from '@tanstack/react-query';

// =============================================================================
// Query Client — Global Configuration
// =============================================================================

/**
 * Creates a configured QueryClient instance
 * Use this in your app root (App.tsx, main.tsx, layout.tsx)
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      /** Default options for all queries */
      queries: {
        /** Number of retry attempts on failure */
        retry: 3,
        
        /** Delay between retries (exponential backoff) */
        retryDelay: (attemptIndex) => 
          Math.min(1000 * 2 ** attemptIndex, 30000),
        
        /** Time in ms before data is considered stale */
        staleTime: 1000 * 60 * 5, // 5 minutes
        
        /** Time in ms that inactive data remains in cache */
        cacheTime: 1000 * 60 * 30, // 30 minutes
        
        /** Refetch on window focus */
        refetchOnWindowFocus: false,
        
        /** Refetch on reconnect */
        refetchOnReconnect: true,
        
        /** Keep previous data while fetching new data */
        placeholderData: (previousData) => previousData,
        
        /** Global error handler */
        onError: (error) => {
          console.error('[Query Error]', error);
          // Optional: Send to error tracking service
          // sentry.captureException(error);
        },
      },
      
      /** Default options for all mutations */
      mutations: {
        /** Number of retry attempts on failure (default: 0 for mutations) */
        retry: 0,
        
        /** Global error handler for mutations */
        onError: (error, variables, context) => {
          console.error('[Mutation Error]', error);
          // Optional: Send to error tracking service
          // sentry.captureException(error);
        },
        
        /** Called on mutation success */
        onSuccess: (data, variables, context) => {
          console.log('[Mutation Success]', data);
        },
      },
    },
  });
}

// =============================================================================
// Singleton Query Client — For use in React apps
// =============================================================================

/**
 * Singleton query client instance
 * Use in client-side apps (React, Next.js client components)
 */
export const queryClient = createQueryClient();

// =============================================================================
// Server Query Client — For use in Server Components
// =============================================================================

/**
 * Creates a fresh QueryClient for server-side usage
 * Each request should get its own instance
 */
export function getServerQueryClient() {
  return createQueryClient();
}

// =============================================================================
// Query Client with Custom Error Handling
// =============================================================================

/**
 * Query client with custom error handling
 */
export function createQueryClientWithErrorHandling(
  onError?: (error: unknown) => void
) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: (attemptIndex) => 
          Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        onError: (error) => {
          console.error('[Query Error]', error);
          onError?.(error);
        },
      },
      mutations: {
        onError: (error, variables, context) => {
          console.error('[Mutation Error]', error);
          onError?.(error);
        },
      },
    },
  });
}

// =============================================================================
// Query Client for Testing
// =============================================================================

/**
 * Creates a QueryClient for testing
 * Disables retries and sets short cache times
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        staleTime: 0,
        cacheTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * Example: Next.js App Router (app/layout.tsx)
 * 
 * ```typescript
 * 'use client';
 * 
 * import { QueryClientProvider } from '@tanstack/react-query';
 * import { queryClient } from '@/lib/query-client';
 * 
 * export function Providers({ children }) {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       {children}
 *     </QueryClientProvider>
 *   );
 * }
 * ```
 */

/**
 * Example: Next.js Server Component
 * 
 * ```typescript
 * import { getServerQueryClient } from '@/lib/query-client';
 * import { dehydrate } from '@tanstack/react-query';
 * 
 * export default async function ServerPage() {
 *   const queryClient = getServerQueryClient();
 *   await queryClient.prefetchQuery({ ... });
 *   
 *   return (
 *     <HydrationBoundary state={dehydrate(queryClient)}>
 *       <ClientComponent />
 *     </HydrationBoundary>
 *   );
 * }
 * ```
 */

/**
 * Example: Vite/React SPA
 * 
 * ```typescript
 * import { QueryClientProvider } from '@tanstack/react-query';
 * import { queryClient } from '@/lib/query-client';
 * 
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <Router />
 *     </QueryClientProvider>
 *   );
 * }
 * ```
 */
