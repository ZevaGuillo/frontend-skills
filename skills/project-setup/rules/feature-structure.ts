// Feature Structure — ALWAYS LOAD
// ~25 lines → ~500 bytes

export const FEATURE_STRUCTURE = {
  layers: ['domain', 'application', 'infrastructure', 'presentation'],
  domain: ['entities', 'types', 'interfaces'],
  application: ['use-cases', 'services'],
  infrastructure: ['api', 'repositories', 'schemas'],
  presentation: ['components', 'hooks', 'pages'],
} as const;

export const LAYER_RULES = {
  domain: { deps: [], desc: 'Pure types, entities, interfaces' },
  application: { deps: ['domain'], desc: 'Business logic, use cases' },
  infrastructure: { deps: ['domain', 'application'], desc: 'API, repositories' },
  presentation: { deps: ['domain', 'application', 'infrastructure'], desc: 'UI components, hooks' },
} as const;

// DEPENDENCY GRAPH
// domain ← application ← infrastructure ← presentation
// shared → ALL (but never ←)
