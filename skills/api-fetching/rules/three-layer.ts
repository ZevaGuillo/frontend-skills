// Three-Layer Pattern — ALWAYS LOAD
// ~30 lines → ~600 bytes

// LAYER 1: API (HTTP only)
export const apiTemplate = (entity => `
// api/\${entity}.api.ts
export const \${entity}Api = {
  getAll: (params?) => axios.get('/\${entity}s', { params }),
  getById: (id) => axios.get(\`/\${entity}s/\${id}\`),
  create: (data) => axios.post('/\${entity}s', data),
  update: (id, data) => axios.patch(\`/\${entity}s/\${id}\`, data),
  delete: (id) => axios.delete(\`/\${entity}s/\${id}\`),
};`);

// LAYER 2: REPOSITORY (business logic)
export const repositoryTemplate = (entity => `
// repositories/\${entity}.repository.ts
export const \${entity}Repository = {
  get\${Entity}s: async (filters) => {
    const { data } = await \${entity}Api.getAll(filters);
    return data;
  },
  get\${Entity}ById: async (id) => (await \${entity}Api.getById(id)).data,
  create\${Entity}: async (dto) => (await \${entity}Api.create(dto)).data,
  update\${Entity}: async (id, dto) => (await \${entity}Api.update(id, dto)).data,
  delete\${Entity}: async (id) => await \${entity}Api.delete(id),
};`);

// LAYER 3: HOOK (useQuery/useMutation)
export const hookTemplate = (entity => `
// hooks/use-\${entity}s.ts
export function use\${Entity}s(filters) {
  return useQuery({
    queryKey: QUERY_KEYS.\${entity}s.list(filters),
    queryFn: () => \${entity}Repository.get\${Entity}s(filters),
  });
}`);

// ❌ NEVER in component: useQuery({ queryKey: ['\${entity}'], queryFn: ... })
