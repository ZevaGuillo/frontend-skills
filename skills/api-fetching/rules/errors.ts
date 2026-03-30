// Error Handling — LOAD: when handling errors
// ~25 lines → ~500 bytes

export const ERROR_HANDLING = `
// THREE LEVELS:
// 1. QueryClient (global)
const qc = new QueryClient({
  defaultOptions: {
    queries: { retry: 3, onError: (e) => console.error(e) },
    mutations: { onError: (e) => toast.error(e.message) },
  },
});

// 2. Repository (domain)
try { await api.get(id) }
catch (e) {
  if (e.response?.status === 401) throw new AuthError();
  if (e.response?.status === 404) throw new NotFoundError();
}

// 3. Component (presentation)
const { isError, error } = useQuery(...);
if (isError) return <Error error={error.message} />;

// SERVER ERRORS → FORM
form.setError('field', { message: error.response?.data?.message })
`;
