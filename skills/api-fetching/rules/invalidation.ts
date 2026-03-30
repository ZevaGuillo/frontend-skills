// Query Invalidation — LOAD: after mutations
// ~15 lines → ~300 bytes

export const INVALIDATION_TEMPLATE = (entity => `
// After mutation - invalidate related queries
onSuccess: () => {
  // Invalidate ALL \${entity} queries
  qc.invalidateQueries({ queryKey: QUERY_KEYS.\${entity}s.all });
  
  // Or specific
  qc.invalidateQueries({ queryKey: QUERY_KEYS.\${entity}s.lists() });
  
  // With filters
  qc.invalidateQueries({ 
    queryKey: QUERY_KEYS.\${entity}s.list({ category: 'a' }) 
  });
}

// MULTI-ENTITY
onSuccess: () => {
  qc.invalidateQueries({ queryKey: QUERY_KEYS.\${entity}s.all });
  qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all }); // related entity
}
`);
