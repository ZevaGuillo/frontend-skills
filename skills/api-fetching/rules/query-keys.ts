// Query Keys — LOAD: when needing query keys
// ~15 lines → ~300 bytes

export const QUERY_KEYS_TEMPLATE = (entity => `
export const QUERY_KEYS = {
  \${entity}s: {
    all: ['\${entity}s'],
    lists: () => ['\${entity}s', 'list'],
    list: (filters) => ['\${entity}s', 'list', filters],
    details: () => ['\${entity}s', 'detail'],
    detail: (id) => ['\${entity}s', 'detail', id],
  },
} as const;
`);

// USAGE
// queryClient.invalidateQueries({ queryKey: QUERY_KEYS.\${entity}s.all })
// queryClient.invalidateQueries({ queryKey: QUERY_KEYS.\${entity}s.list({ category: 'a' }) })
