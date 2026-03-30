// Optimistic Updates — LOAD: when mutation needs optimistic update
// ~30 lines → ~600 bytes

export const OPTIMISTIC_UPDATE_TEMPLATE = (entity => `
export function useUpdate\${Entity}() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }) => repo.update\${Entity}(id, dto),
    onMutate: async ({ id, dto }) => {
      await qc.cancelQueries({ queryKey: QUERY_KEYS.\${entity}s.detail(id) });
      const prev = qc.getQueryData(QUERY_KEYS.\${entity}s.detail(id));
      qc.setQueryData(QUERY_KEYS.\${entity}s.detail(id), old => ({ ...old, ...dto }));
      return { prev };
    },
    onError: (_err, { id }, ctx) => {
      qc.setQueryData(QUERY_KEYS.\${entity}s.detail(id), ctx.prev);
    },
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.\${entity}s.detail(id) });
    },
  });
}`);

// DELETE EXAMPLE
// onMutate: async (id) => {
//   await qc.cancelQueries({ queryKey: QUERY_KEYS.\${entity}s.all });
//   qc.setQueriesData({ queryKey: QUERY_KEYS.\${entity}s.lists() },
//     old => ({ ...old, data: old.data.filter(x => x.id !== id) }));
// }
