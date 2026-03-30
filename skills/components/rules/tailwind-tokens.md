# Rule: Tailwind Semantic Tokens

> Always use semantic tokens from the theme. Never use hardcoded color values like `bg-blue-500` or `text-gray-700`.

## Why It Matters

- **Theme consistency** — Change once, update everywhere
- **Dark mode support** — Tokens auto-adapt
- **Accessibility** — Semantic meaning (muted for secondary text)
- **Easy theming** — Neon, grayscale, or custom brand in one place

---

## Semantic Token Reference

### Brand Colors

| Token | Usage | Default |
|-------|-------|---------|
| `primary` | Main brand color | Blue |
| `primary-foreground` | Text on primary | White |
| `secondary` | Secondary actions | Gray |
| `secondary-foreground` | Text on secondary | White |

### Backgrounds

| Token | Usage | Default |
|-------|-------|---------|
| `background` | Page background | White |
| `foreground` | Primary text | Gray 900 |
| `muted` | Subtle backgrounds | Gray 100 |
| `muted-foreground` | Secondary text | Gray 500 |
| `accent` | Interactive highlights | Gray 100 |
| `accent-foreground` | Text on accent | Gray 900 |

### States

| Token | Usage | Default |
|-------|-------|---------|
| `destructive` | Error/danger actions | Red |
| `destructive-foreground` | Text on destructive | White |
| `success` | Success state (custom) | Green |
| `warning` | Warning state (custom) | Yellow |
| `info` | Info state (custom) | Blue |

### Borders & Rings

| Token | Usage | Default |
|-------|-------|---------|
| `border` | Default borders | Gray 200 |
| `input` | Input borders | Gray 200 |
| `ring` | Focus ring | Primary |
| `radius` | Border radius | 0.375rem |

---

## Correct Usage

```tsx
// ✅ CORRECT: Using semantic tokens
function Button({ children, variant = 'default' }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        
        // Variants using tokens
        variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        variant === "outline" && "border border-input hover:bg-accent hover:text-accent-foreground",
        variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
        variant === "link" && "text-primary underline-offset-4 hover:underline",
      )}
    >
      {children}
    </button>
  );
}
```

---

## Incorrect Usage

```tsx
// ❌ INCORRECT: Hardcoded values
function Button({ children }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium",
        "bg-blue-500 text-white hover:bg-blue-600",  // Hardcoded!
        "focus:ring-2 focus:ring-blue-500",          // Hardcoded!
      )}
    >
      {children}
    </button>
  );
}
```

**Problems:**
- Not themeable
- No dark mode support
- Inconsistent with other components
- Hard to find and replace

---

## Theme Configuration

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
  },
}
```

---

## Opacity Modifiers

Use opacity modifiers with tokens:

```tsx
// Background with opacity
bg-primary/10      // 10% opacity of primary
bg-primary/20      // 20% opacity
bg-primary/90      // 90% opacity (mostly opaque)

// Hover states
hover:bg-primary/10
hover:text-muted-foreground/80
```

---

## Theming Examples

### Default (Blue)

```js
--primary: 222.2 47.4% 11.2%
--primary-foreground: 210 40% 98%
```

### Neon Theme

```js
--primary: 142 76% 46%     // Neon green
--primary-foreground: 0 0% 0%
```

### Grayscale

```js
--primary: 0 0% 20%       // Dark gray
--primary-foreground: 0 0% 100%
```

---

## Dark Mode

Tokens automatically adapt:

```tsx
// Same class works for both light and dark
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Secondary text</p>
  <button className="bg-primary text-primary-foreground">
    Primary action
  </button>
</div>
```

---

## References

- SKILL.md: Components overview
- `rules/shadcn-base.md`: Using shadcn components
- `templates/component.template.tsx`: Template with tokens
