# Rule: Compound Components

> Build complex UIs with composable sub-components that work together. Parent manages state, children receive context.

## Why It Matters

- **Flexible composition** — Users choose what to render
- **Implicit state** — State shared via React context
- **Semantic HTML** — Meaningful structure
- **Type safety** — Children typed by context

---

## Pattern: Parent + Children

```tsx
// Compound component structure
<Parent>
  <ChildA />
  <ChildB />
  <ChildC />
</Parent>
```

### Implementation

```tsx
// components/card.tsx
import { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Context type
interface CardContextType {
  variant?: 'default' | 'outline';
}

const CardContext = createContext<CardContextType>({});

// Parent component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div 
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          variant === "outline" && "border-2 border-primary",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

// Sub-components
export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useContext(CardContext);
  
  return (
    <div 
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Usage

```tsx
// Usage
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

function Example() {
  return (
    <Card variant="outline">
      <CardHeader>
        <CardTitle>Project Title</CardTitle>
        <CardDescription>
          This is a project description that provides context.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  );
}
```

---

## Accordion Example

```tsx
// components/accordion.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface AccordionContextType {
  value?: string;
  onValueChange: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType>({});

interface AccordionProps {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Accordion({ children, value, onValueChange }: AccordionProps) {
  return (
    <AccordionContext.Provider value={{ value, onValueChange: onValueChange || (() => {}) }}>
      <div className="space-y-2">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
}

export function AccordionItem({ value, children }: AccordionItemProps) {
  return <div className="border-b">{children}</div>;
}

interface AccordionTriggerProps {
  children: ReactNode;
}

export function AccordionTrigger({ children }: AccordionTriggerProps) {
  const { value, onValueChange } = useContext(AccordionContext);
  const isOpen = value === children; // Simplified
  
  return (
    <button
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline",
        isOpen && "text-primary"
      )}
      onClick={() => onValueChange(String(children))}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
    </button>
  );
}

interface AccordionContentProps {
  children: ReactNode;
}

export function AccordionContent({ children }: AccordionContentProps) {
  const { value } = useContext(AccordionContext);
  
  return (
    <div className={cn("pb-4 text-sm text-muted-foreground", value ? "block" : "hidden")}>
      {children}
    </div>
  );
}
```

---

## Incorrect Example

```tsx
// ❌ DON'T: Flat props for everything
interface CardProps {
  title: string;
  description?: string;
  content: ReactNode;
  footer?: ReactNode;
  titleClass?: string;
  contentClass?: string;
  // ... 20 more props
}

export function Card({ title, description, content, footer, ... }: CardProps) {
  return (
    <div>
      <h3 className={titleClass}>{title}</h3>
      {description && <p>{description}</p>}
      <div className={contentClass}>{content}</div>
      {footer && <div>{footer}</div>}
    </div>
  );
}
```

---

## When to Use

| Use Compound When | Don't Use When |
|-------------------|----------------|
| Multiple sections (Card) | Simple, single-purpose (Button) |
| State shared between parts | Independent components |
| Flexible composition needed | Fixed structure |
| Semantic meaning matters | Generic wrapper |

---

## References

- SKILL.md: Components overview
- `rules/shadcn-base.md`: Using shadcn as base
- `templates/compound-component.template.tsx`: Template
