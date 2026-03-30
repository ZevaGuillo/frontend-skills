---
name: components
description: Guides the creation of React components using shadcn/ui as a base with compound component patterns. Use this skill when creating a new UI component, extending shadcn components, or deciding component composition strategy.
license: MIT
---

# Skill: components

> React components with shadcn/ui base, compound patterns, and Tailwind semantic tokens.

## When to Apply

Activate this skill when:

- Creating a new UI component
- Extending shadcn/ui components
- Deciding component composition strategy
- Building compound components
- Implementing component variants
- Typing component props

## Quick Reference

- `[PATTERN]` Use shadcn/ui as base foundation
- `[PATTERN]` Composition over inheritance
- `[MUST]` Tailwind semantic tokens (no hardcoded values)
- `[PREFERRED]` Compound components for complex states
- `[PREFERRED]` Variants via prop, not new components
- `[MUST]` Type-safe props with interfaces
- `[MUST]` Use `cn()` for conditional classes

## Rules

| Priority | Rule | Impact | Reference File |
|----------|------|--------|-----------------|
| 1 | shadcn/ui as base | High | `rules/shadcn-base.md` |
| 2 | Compound components | High | `rules/compound-components.md` |
| 3 | Tailwind semantic tokens | High | `rules/tailwind-tokens.md` |
| 4 | Component slots | Medium | `rules/component-slots.md` |
| 5 | Variants pattern | Medium | `rules/variants-pattern.md` |
| 6 | Props typing | High | `rules/props-typing.md` |

## Detail by Category

### shadcn/ui Base

Use shadcn/ui components as foundation:

- `Button`, `Input`, `Select` — Form elements
- `Card`, `Dialog`, `Sheet` — Layout containers
- `Table`, `Tabs`, `Accordion` — Complex patterns
- Always extend, never fork

### Tailwind Tokens

Use semantic tokens from shadcn theme:

- `primary`, `primary-foreground` — Main brand color
- `secondary`, `secondary-foreground` — Secondary color
- `muted`, `muted-foreground` — Subtle backgrounds
- `accent`, `accent-foreground` — Interactive highlights
- `destructive`, `destructive-foreground` — Error states
- `border`, `ring` — Borders and focus rings
- `radius` — Border radius token

**Never use:** `bg-blue-500`, `text-gray-700` — Always use theme tokens.

### Compound Components

Build complex UIs with composable parts:

```tsx
// Compound: Card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Variants

One prop, multiple styles — not new components:

```tsx
// ✅ One component with variants
<Button variant="default" />
<Button variant="destructive" />
<Button variant="outline" />
<Button variant="ghost" />
<Button variant="link" />

// ❌ Not: <DestructiveButton />
```

---

## Templates

- `templates/component.template.tsx` — Basic component with cn()
- `templates/compound-component.template.tsx` — Compound component pattern
- `templates/component.variants.ts` — Variants with cva

## Tailwind Theme Structure

```js
// tailwind.config.js - tokens are customizable
colors: {
  primary: { DEFAULT: "...", foreground: "..." },
  secondary: { DEFAULT: "...", foreground: "..." },
  muted: { DEFAULT: "...", foreground: "..." },
  accent: { DEFAULT: "...", foreground: "..." },
  destructive: { DEFAULT: "...", foreground: "..." },
  border: "...",
  ring: "...",
  radius: "...",
}
```

## Anti-Patterns

- ❌ Using hardcoded colors (`bg-blue-500`)
- ❌ Creating new components for variants
- ❌ Props without TypeScript interfaces
- ❌ Using inline styles
- ❌ Forking shadcn components instead of extending
