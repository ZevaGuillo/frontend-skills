# Rule: Variants Pattern

> Use one prop for multiple visual styles, not separate components. Use class-variance-authority (cva) for type-safe variants.

## Why It Matters

- **Type safety** — Variants typed by cva
- **One component** — Easier maintenance
- **Consistent API** — Same prop across components
- **Easy to extend** — Add variant without creating new component

---

## Using class-variance-authority (cva)

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base classes - always applied
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ 
  className, 
  variant, 
  size, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

---

## Usage

```tsx
// All variants of the SAME component
<Button variant="default">Primary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

---

## Custom Component Variants

```tsx
// components/badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500 text-white",
        warning: "border-transparent bg-yellow-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
```

---

## Complex Variants

```tsx
// components/card.tsx
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2 border-primary",
        filled: "bg-muted border-transparent",
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
      hover: {
        none: "",
        default: "hover:shadow-md transition-shadow",
        lift: "hover:-translate-y-1 hover:shadow-lg transition-all",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      hover: "none",
    },
  }
);

// Usage
<Card variant="outline" padding="lg" hover="lift">
  <CardHeader>...</CardHeader>
</Card>
```

---

## Incorrect Examples

```tsx
// ❌ DON'T: Create new components for variants
<DefaultButton>Primary</DefaultButton>
<DestructiveButton>Danger</DestructiveButton>
<OutlineButton>Outline</OutlineButton>
<GhostButton>Ghost</GhostButton>

// ❌ DON'T: Use boolean props
<Button primary />       // What does this mean?
<Button outlined />
<Button shadow />
<Button rounded />
```

---

## Correct: Variants Prop

```tsx
// ✅ CORRECT: One component with variants prop
<Button variant="default" />
<Button variant="destructive" />
<Button variant="outline" />
<Button variant="ghost" />
<Button variant="link" />
```

---

## Combining Variants

```tsx
// Multiple variant dimensions
<Card 
  variant="outline" 
  padding="lg" 
  hover="lift"
>
  Content
</Card>

<Button 
  variant="outline" 
  size="lg"
  className="w-full"
>
  Action
</Button>
```

---

## TypeScript Benefits

```tsx
// cva provides full TypeScript support
const buttonVariants = cva(...);

// Autocomplete works!
<Button variant="d" />     // Shows: destructive
<Button size="i" />        // Shows: icon

// Error on invalid variant
<Button variant="invalid" />  // TypeScript error
```

---

## When to Use Variants

| Use Variants When | Create New Component When |
|-------------------|---------------------------|
| Visual style changes | Fundamentally different behavior |
| Same component usage | Different prop API |
| 2-10 variants | More than 10 variants |
| Consistent prop interface | One-off special case |

---

## References

- SKILL.md: Components overview
- `rules/shadcn-base.md`: shadcn usage
- `rules/tailwind-tokens.md`: Semantic tokens
- `templates/component.variants.ts`: Template
