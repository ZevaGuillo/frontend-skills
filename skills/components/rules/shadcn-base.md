# Rule: shadcn/ui as Base

> Use shadcn/ui components as the foundation for all UI components. Always extend, never fork.

## Why It Matters

- **Accessibility** — shadcn/ui components are WCAG compliant
- **Customizability** — Full control over code, not a library
- **Consistency** — Same patterns across the codebase
- **Maintenance** — Update by copying new versions
- **Design system** — Built-in semantic tokens

---

## Base Components

### Form Elements

| Component | Purpose |
|-----------|---------|
| `Button` | All clickable actions |
| `Input` | Text input fields |
| `Select` | Dropdown selection |
| `Checkbox` | Binary selection |
| `RadioGroup` | Single selection from options |
| `Switch` | Toggle on/off |
| `Textarea` | Multi-line text |

### Layout Containers

| Component | Purpose |
|-----------|---------|
| `Card` | Content container with sections |
| `Dialog` | Modal overlay |
| `Sheet` | Slide-out panel |
| `Drawer` | Mobile navigation |
| `Popover` | Floating content |
| `Tooltip` | Hover information |

### Complex Patterns

| Component | Purpose |
|-----------|---------|
| `Table` | Data tables |
| `Tabs` | Tabbed content |
| `Accordion` | Collapsible sections |
| `Collapsible` | Expand/collapse content |
| `Badge` | Status indicators |
| `Skeleton` | Loading placeholders |

---

## Using as Base

### Extend, Don't Fork

```tsx
// ✅ CORRECT: Extend shadcn Button
// components/ui/extended-button.tsx
import { Button } from '@/components/ui/button';

interface ExtendedButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
}

export function ExtendedButton({ loading, children, ...props }: ExtendedButtonProps) {
  return (
    <Button disabled={loading} {...props}>
      {loading && <Spinner className="mr-2 h-4 w-4" />}
      {children}
    </Button>
  );
}
```

```tsx
// ❌ INCORRECT: Copy-pasting and modifying
// Don't do this - you'll lose updates
import { Button } from 'some-random-library';
// ... modified version
```

### Composition with shadcn

```tsx
// ✅ CORRECT: Compose with shadcn components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ProductCard({ product }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{product.description}</p>
        <Button>Add to cart</Button>
      </CardContent>
    </Card>
  );
}
```

---

## When to Create Custom Components

| Scenario | Use shadcn | Create Custom |
|----------|-----------|---------------|
| Button, Input, Select | ✅ | ❌ |
| Card container | ✅ | Maybe |
| Data table | ✅ | Maybe |
| Complex dashboard widget | ❌ | ✅ |
| Domain-specific visualization | ❌ | ✅ |
| Feature-specific composite | ❌ | ✅ |

---

## Installation

```bash
# Add shadcn components
npx shadcn@latest add button card input dialog
```

---

## Customizing Theme

```js
// tailwind.config.js
// Change once, affects ALL components
colors: {
  primary: {
    DEFAULT: "#0ea5e9",     // Change to neon: "#39ff14"
    foreground: "#ffffff",
  },
  secondary: {
    DEFAULT: "#64748b",
    foreground: "#ffffff",
  },
  // All tokens in one place
}
```

---

## References

- SKILL.md: Components overview
- `rules/tailwind-tokens.md`: Semantic tokens
- `rules/variants-pattern.md`: Component variants
