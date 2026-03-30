// Mutation Integration — LOAD: when connecting to API
// ~20 lines → ~400 bytes

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreate[Entity]() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => api.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[entities]'] });
    },
  });
}

// IN FORM:
const mutation = useCreate[Entity]();
const onSubmit = form.handleSubmit(async (data) => {
  await mutation.mutateAsync(data);
  form.reset();
});
