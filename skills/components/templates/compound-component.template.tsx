/**
 * Compound Component Template
 * 
 * Complex component with composable sub-components
 * Parent manages state, children receive context
 * 
 * Replace: [Entity] with your entity name (e.g., Card, Accordion, Tabs)
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// =============================================================================
// Context — Share state between sub-components
// =============================================================================

interface [Entity]ContextType {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

const [Entity]Context = React.createContext<[Entity]ContextType>({});

// =============================================================================
// Parent Component
// =============================================================================

const [entity]Variants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2 border-primary",
      },
      size: {
        sm: "text-sm",
        default: "",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface [Entity]Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof [entity]Variants> {
  /**
   * Visual variant
   */
  variant?: 'default' | 'outline';
  /**
   * Size variant
   */
  size?: 'sm' | 'default' | 'lg';
}

export function [Entity]({ 
  className, 
  variant, 
  size,
  children, 
  ...props 
}: [Entity]Props) {
  return (
    <[Entity]Context.Provider value={{ variant, size }}>
      <div 
        className={cn([entity]Variants({ variant, size }), className)}
        {...props}
      >
        {children}
      </div>
    </[Entity]Context.Provider>
  );
}

// =============================================================================
// Sub-Component: Header
// =============================================================================

export interface [Entity]HeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function [Entity]Header({ 
  className, 
  children, 
  ...props 
}: [Entity]HeaderProps) {
  return (
    <div 
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// =============================================================================
// Sub-Component: Title
// =============================================================================

export interface [Entity]TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export function [Entity]Title({ 
  className, 
  children, 
  ...props 
}: [Entity]TitleProps) {
  const { size } = React.useContext([Entity]Context);
  
  return (
    <h3 
      className={cn(
        "font-semibold leading-none tracking-tight",
        size === "sm" && "text-sm",
        size === "lg" && "text-xl",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

// =============================================================================
// Sub-Component: Description
// =============================================================================

export interface [Entity]DescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function [Entity]Description({ 
  className, 
  children, 
  ...props 
}: [Entity]DescriptionProps) {
  return (
    <p 
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}

// =============================================================================
// Sub-Component: Content
// =============================================================================

export interface [Entity]ContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function [Entity]Content({ 
  className, 
  children, 
  ...props 
}: [Entity]ContentProps) {
  return (
    <div 
      className={cn("p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// =============================================================================
// Sub-Component: Footer
// =============================================================================

export interface [Entity]FooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function [Entity]Footer({ 
  className, 
  children, 
  ...props 
}: [Entity]FooterProps) {
  return (
    <div 
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// =============================================================================
// Compound Component Usage
// =============================================================================

/**
 * // Full compound usage
 * <[Entity] variant="outline" size="lg">
 *   <[Entity]Header>
 *     <[Entity]Title>Title</[Entity]Title>
 *     <[Entity]Description>Description text</[Entity]Description>
 *   </[Entity]Header>
 *   <[Entity]Content>
 *     Main content goes here
 *   </[Entity]Content>
 *   <[Entity]Footer>
 *     <Button>Action</Button>
 *   </[Entity]Footer>
 * </[Entity]>
 * 
 * // Minimal usage
 * <[Entity]>
 *   <[Entity]Content>
 *     Just content
 *   </[Entity]Content>
 * </[Entity]>
 */

// =============================================================================
// Alternative: Accordion-style Compound
// =============================================================================

interface Accordion[Entity]ContextType {
  value?: string;
  onValueChange?: (value: string) => void;
}

const Accordion[Entity]Context = React.createContext<Accordion[Entity]ContextType>({});

interface Accordion[Entity]Props {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Accordion[Entity]({ 
  children, 
  value, 
  onValueChange,
  className 
}: Accordion[Entity]Props) {
  return (
    <Accordion[Entity]Context.Provider value={{ value, onValueChange }}>
      <div className={cn("space-y-2", className)}>
        {children}
      </div>
    </Accordion[Entity]Context.Provider>
  );
}

interface Accordion[Entity]ItemProps {
  value: string;
  children: React.ReactNode;
}

export function Accordion[Entity]Item({ value, children }: Accordion[Entity]ItemProps) {
  return <div className="border-b">{children}</div>;
}

interface Accordion[Entity]TriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion[Entity]Trigger({ 
  children, 
  className 
}: Accordion[Entity]TriggerProps) {
  const { value, onValueChange } = React.useContext(Accordion[Entity]Context);
  const isOpen = value === children;
  
  return (
    <button
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline",
        isOpen && "text-primary",
        className
      )}
      onClick={() => onValueChange?.(String(children))}
    >
      {children}
      <ChevronDown className={cn(
        "h-4 w-4 transition-transform",
        isOpen && "rotate-180"
      )} />
    </button>
  );
}

interface Accordion[Entity]PanelProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion[Entity]Panel({ 
  children, 
  className 
}: Accordion[Entity]PanelProps) {
  const { value } = React.useContext(Accordion[Entity]Context);
  
  return (
    <div className={cn(
      "pb-4 text-sm text-muted-foreground",
      value ? "block" : "hidden",
      className
    )}>
      {children}
    </div>
  );
}

/**
 * // Accordion usage
 * <Accordion[Entity] value={activeItem} onValueChange={setActiveItem}>
 *   <Accordion[Entity]Item value="item1">
 *     <Accordion[Entity]Trigger>What is this?</Accordion[Entity]Trigger>
 *     <Accordion[Entity]Panel>Answer here...</Accordion[Entity]Panel>
 *   </Accordion[Entity]Item>
 * </Accordion[Entity]>
 */
