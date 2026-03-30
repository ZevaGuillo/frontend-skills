// Feature README Template — LOAD: when generating feature docs
// ~25 lines → ~500 bytes

export const README_TEMPLATE = (featureName: string, exports: string[]) => `# Feature: ${featureName}

## Purpose
[One sentence describing this feature]

## Public API (from index.ts)
${exports.map(e => `- \`${e}\``).join('\n')}

## Dependencies
- External: @tanstack/react-query, @/lib/axios
- Internal: [any feature dependencies]

## Structure
- \`domain/\` — Types, entities
- \`application/\` — Use cases
- \`infrastructure/\` — API, repositories
- \`presentation/\` — Components, hooks

---
*Auto-generated. Edit source to update.*
`;

// GENERATE COMMAND
// npx setup:readme [feature-name]
