---
name: forms
description: Implements forms using React Hook Form with Zod validation. Use this skill when building any form, adding field validation, or connecting a form to a mutation hook.
license: MIT
---

# forms — Execution Protocol

## Phase 1: Intent Detection

### IF user says:
- "create form" / "build form" / "add form"
- "form validation" / "validate fields"
- "connect form to API" / "form with mutation"
- "conditional fields" / "dependent fields"
- "form schema" / "zod schema"

→ THEN activate forms skill

### IF user asks:
- "what's the form structure?" → explain WITHOUT loading rules
- "example of form" → use minimal template from rules/minimal-template.ts

## Phase 2: Context Selection (LAZY LOAD)

### Required (ALWAYS):
- rules/schema-structure.ts (if creating/updating schema)
- rules/hook-config.ts (if configuring useForm)

### Conditional (LOAD ON DEMAND):
| User Intent | Load Rule |
|------------|-----------|
| "conditional field" | rules/conditional.ts |
| "dependent validation" | rules/dependent.ts |
| "shadcn integration" | rules/shadcn.ts |
| "error handling" | rules/errors.ts |
| "mutation integration" | rules/mutation.ts |
| "field types" | rules/fields.ts |

## Phase 3: Decision Tree

```
User Request
    │
    ├─► New form? → schema-structure.ts → use minimal-template.ts
    │
    ├─► Update existing? → hook-config.ts
    │
    ├─► Conditional field? → LOAD: conditional.ts → schema + component
    │
    ├─► Dependent validation? → LOAD: dependent.ts → refine() pattern
    │
    ├─► Connect mutation? → LOAD: mutation.ts → useMutation integration
    │
    └─► Error handling? → LOAD: errors.ts → server errors → form.setError()
```

## Phase 4: Output Generation

### DO:
- Generate ONLY requested functionality
- Use templates from rules/templates/
- Keep code minimal
- Reference external docs for context

### DON'T:
- Load unused rules
- Explain concepts proactively
- Add examples beyond request
- Include "why it matters" sections

## Quick Reference

| Pattern | Location |
|---------|----------|
| Schema skeleton | rules/schema-skeleton.ts |
| useForm config | rules/hook-config.ts |
| Shadcn wrapper | rules/shadcn.ts |
| Zod + RHF | rules/zod-rhf.ts |
| Mutation hook | rules/mutation.ts |
| Conditional | rules/conditional.ts |

## Commands

```
npx forms:init [entity]     → Generate form files
npx forms:field [type]      → Add field component
npx forms:validate [rule]    → Add validation
```
