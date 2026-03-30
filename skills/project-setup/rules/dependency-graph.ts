// Dependency Graph — LOAD: on dependency issues
// ~20 lines → ~400 bytes

export const DEPENDENCY_MATRIX = {
  // FROM \ TO: domain | application | infrastructure | presentation | shared | feature-B
  domain:       { domain: 1, app: 1, infra: 1, pres: 1, shared: 1, featureB: 1 },
  application:  { domain: 0, app: 1, infra: 1, pres: 1, shared: 1, featureB: 1 },
  infrastructure:{domain: 0, app: 0, infra: 1, pres: 1, shared: 1, featureB: 1 },
  presentation:{ domain: 0, app: 0, infra: 0, pres: 1, shared: 1, featureB: 0 }, // NEVER from feature!
  shared:      { domain: 0, app: 0, infra: 0, pres: 0, shared: 1, featureB: 0 },
} as const;

// RULE: Feature A → Feature B ONLY via Feature B/index.ts
// ❌ import from @/features/B/presentation/components
// ✅ import from @/features/B

// SHARED RULE: shared → feature = FORBIDDEN
