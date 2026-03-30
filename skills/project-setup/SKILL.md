---
name: project-setup
description: Scaffolds a new frontend project or feature following screaming architecture by feature. Use this skill when the user wants to create a new project, initialize a React application, add a new feature folder, or set up the base structure for a frontend app with TypeScript, Tailwind CSS, and shadcn/ui.
license: MIT
---

# project-setup — Execution Protocol

## Phase 1: Intent Detection

### IF user says:
- "set up project" / "initialize project"
- "create feature" / "add feature"
- "project structure" / "how to organize code"
- "refactor to feature architecture"
- "scaffolding" / "boilerplate"

→ THEN activate project-setup skill

### IF user asks:
- "what's the folder structure?" → explain WITHOUT loading rules

## Phase 2: Context Selection (LAZY LOAD)

### Required (ALWAYS):
- rules/feature-structure.ts (always needed)

### Conditional (LOAD ON DEMAND):
| User Context | Load Rule |
|-------------|-----------|
| New project | rules/project-init.ts |
| New feature | rules/feature-scaffold.ts |
| Dependency issues | rules/dependency-graph.ts |
| Naming questions | rules/naming.ts |
| Framework: Next.js | rules/nextjs.ts |
| Framework: TanStack | rules/tanstack.ts |
| Framework: Vite | rules/vite.ts |
| Feature READMEs | rules/feature-readme.ts |

## Phase 3: Decision Tree

```
User Request
    │
    ├─► New project? → LOAD: project-init.ts → generate structure
    │
    ├─► New feature? → LOAD: feature-scaffold.ts → generate feature folders
    │
    ├─► Dependency issue? → LOAD: dependency-graph.ts → enforce rules
    │
    ├─► Framework: Next.js? → LOAD: nextjs.ts → app/ structure
    │
    ├─► Framework: TanStack? → LOAD: tanstack.ts → routes/ structure
    │
    └─► Framework: Vite? → LOAD: vite.ts → pages/ structure
```

## Phase 4: Output Generation

### DO:
- Generate folder structure from templates
- Create index.ts with barrel exports
- Generate feature README
- Apply naming conventions

### DON'T:
- Load unused framework adapters
- Explain architectural decisions proactively
- Add rules not requested

## Quick Reference

| Pattern | Location |
|---------|----------|
| Feature folder structure | rules/feature-structure.ts |
| Feature scaffold | rules/feature-scaffold.ts |
| Dependency rules | rules/dependency-graph.ts |
| Naming conventions | rules/naming.ts |
| Next.js adapter | rules/nextjs.ts |
| TanStack adapter | rules/tanstack.ts |

## Commands

```
npx setup:project [name]     → Initialize new project
npx setup:feature [name]    → Create feature folders
npx setup:framework [nextjs|tanstack|vite] → Setup adapter
```
