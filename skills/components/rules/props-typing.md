# Rule: Props Typing

> Always define TypeScript interfaces for component props. Use proper typing patterns for maintainability and developer experience.

## Why It Matters

- **Type safety** — Errors caught at compile time
- **IDE support** — Autocomplete for props
- **Documentation** — Props serve as documentation
- **Maintenance** — Easy to see what a component accepts

---

## Basic Props Interface

```tsx
// components/greeting.tsx
interface GreetingProps {
  name: string;
}

export function Greeting({ name }: GreetingProps) {
  return <div>Hello, {name}!</div>;
}
```

---

## Optional Props

```tsx
// components/greeting.tsx
interface GreetingProps {
  name: string;
  greeting?: string;  // Optional - has default
}

export function Greeting({ name, greeting = 'Hello' }: GreetingProps) {
  return <div>{greeting}, {name}!</div>;
}

// Usage
<Greeting name="World" />           // "Hello, World!"
<Greeting name="John" greeting="Hi" /> // "Hi, John!"
```

---

## Extending HTML Props

```tsx
// components/button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function Button({ 
  className, 
  variant = 'default', 
  size = 'default',
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={cn("base-classes", className)} 
      {...props} 
    />
  );
}
```

**All these are now available:**
```tsx
<Button 
  onClick={() => {}}
  disabled={true}
  type="submit"
  aria-label="Click me"
  className="custom-class"
  // ... all HTML button props
/>
```

---

## Extending shadcn Props

```tsx
// components/custom-button.tsx
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';

interface CustomButtonProps extends ShadcnButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

export function CustomButton({ 
  loading, 
  icon, 
  children, 
  ...props 
}: CustomButtonProps) {
  return (
    <ShadcnButton disabled={loading} {...props}>
      {loading ? <Spinner className="mr-2" /> : icon}
      {children}
    </ShadcnButton>
  );
}
```

---

## Generic Components

```tsx
// components/list.tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export function List<T>({ 
  items, 
  renderItem, 
  keyExtractor,
  emptyMessage = 'No items' 
}: ListProps<T>) {
  if (items.length === 0) {
    return <div className="text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// Usage with full type safety
<List
  items={users}
  keyExtractor={(user) => user.id}
  renderItem={(user) => <div>{user.name}</div>}
/>
```

---

## Union Types for Props

```tsx
// components/alert.tsx
type AlertVariant = 'default' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
}

export function Alert({ variant = 'default', title, children, onDismiss }: AlertProps) {
  const variantStyles = {
    default: 'bg-primary text-primary-foreground',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-destructive text-destructive-foreground',
  };

  return (
    <div className={variantStyles[variant]}>
      {title && <strong>{title}</strong>}
      {children}
      {onDismiss && <button onClick={onDismiss}>Dismiss</button>}
    </div>
  );
}
```

---

## Event Handlers

```tsx
// components/input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
}

export function Input({ 
  label, 
  error, 
  helperText,
  onChange,
  ...props 
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && <label>{label}</label>}
      <input 
        onChange={(e) => onChange?.(e.target.value)}
        className={error ? 'border-destructive' : ''}
        {...props} 
      />
      {(error || helperText) && (
        <p className={error ? 'text-destructive text-sm' : 'text-muted-foreground text-sm'}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
```

---

## Incorrect Examples

```tsx
// ❌ DON'T: Any type
function Button(props: any) { ... }

// ❌ DON'T: No interface
function Button({ className, children, ...props }) { ... }

// ❌ DON'T: Inconsistent typing
function Button(props: { className?: string, children }) { ... }
```

---

## Correct: Full Interface

```tsx
// ✅ CORRECT: Proper interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  variant = 'default', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  // Implementation
}
```

---

## Best Practices

1. **Always define interface** — Even for simple components
2. **Extend HTML props** — For common props (onClick, className, etc.)
3. **Use proper types** — `string`, `boolean`, not `any`
4. **Optional with defaults** — Use `?` and provide defaults
5. **Document with JSDoc** — For complex props

---

## References

- SKILL.md: Components overview
- `rules/variants-pattern.md`: Variant props
- `rules/component-slots.md`: Children as slots
- `templates/component.template.tsx`: Full template
