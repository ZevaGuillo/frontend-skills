# Rule: Component Slots

> Use React children and explicit slot props for flexible component composition. Let users decide what to render.

## Why It Matters

- **Flexibility** — Users control rendering
- **Type safety** — Children typed by parent
- **Composition** — Build complex UIs from simple parts
- **Clean API** — No prop explosion

---

## Pattern: Children as Slot

### Basic Children

```tsx
// components/container.tsx
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

// Usage
<Container>
  <h1>Title</h1>
  <p>Content</p>
</Container>
```

---

## Pattern: Named Slots

### With asChild

```tsx
// components/slot.tsx
import { Slot } from '@radix-ui/react-slot';

interface SlotProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export function Slot({ asChild, children }: SlotProps) {
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      // Merge props
    });
  }
  return children;
}
```

```tsx
// Usage with asChild
<Slot asChild>
  <Button>Click me</Button>
</Slot>
```

---

## Pattern: Multiple Slots

```tsx
// components/feature-card.tsx
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: FeatureCardProps) {
  return (
    <div className={cn("p-6 rounded-lg border bg-card", className)}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

// Usage
<FeatureCard
  icon={<Icon />}
  title="Feature Title"
  description="This is what this feature does."
  action={<Button>Learn more</Button>}
/>
```

---

## Pattern: Optional Slots with Defaults

```tsx
// components/card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  // If no children provided, don't render
  if (!children) return null;
  
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("p-6 pt-0", className)}>
      {children}
    </div>
  );
}

// Usage - only render what you need
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content without description or footer</p>
  </CardContent>
</Card>
```

---

## Pattern: Render Props (For Complex Cases)

```tsx
// components/data-list.tsx
interface DataListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

export function DataList<T>({ items, renderItem, keyExtractor }: DataListProps<T>) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={keyExtractor(item)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

// Usage
<DataList
  items={users}
  keyExtractor={(user) => user.id}
  renderItem={(user) => <div>{user.name}</div>}
/>
```

---

## Incorrect Example

```tsx
// ❌ DON'T: Prop explosion
interface ButtonProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  beforeContent?: React.ReactNode;
  afterContent?: React.ReactNode;
  mainContent?: React.ReactNode;
  // ... 10 more slots as props
}
```

---

## Correct: Use Children

```tsx
// ✅ CORRECT: Flexible composition with children
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={cn(variantClasses, sizeClasses, className)} {...props}>
      {children}
    </button>
  );
}

// Users compose however they want
<Button>
  <Icon className="mr-2" />
  <span>Click me</span>
  <ArrowRight className="ml-2" />
</Button>
```

---

## Best Practices

1. **Prefer children** — Most flexible
2. **Named props for optional sections** — Like CardHeader, CardContent
3. **Use asChild sparingly** — Only when merging with Radix primitives
4. **Keep slots simple** — Don't over-engineer

---

## References

- SKILL.md: Components overview
- `rules/compound-components.md`: Compound pattern
- `rules/props-typing.md`: Type-safe props
