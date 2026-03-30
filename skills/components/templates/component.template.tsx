/**
 * Component Template
 * 
 * Basic component with:
 * - cn() for conditional classes
 * - Variants with cva
 * - Proper TypeScript props
 * - Semantic Tailwind tokens
 * 
 * Replace: [ComponentName] with your component name
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// =============================================================================
// Variants — Define visual variations
// =============================================================================

const [componentName]Variants = cva(
  // Base classes — always applied
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary action — uses primary token (themeable)
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        
        // Destructive/error actions
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        
        // Outlined style
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        
        // Secondary/alternative actions
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        // Subtle background
        ghost: "hover:bg-accent hover:text-accent-foreground",
        
        // Text-only link style
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Default size
        default: "h-10 px-4 py-2",
        
        // Small
        sm: "h-9 rounded-md px-3",
        
        // Large
        lg: "h-11 rounded-md px-8",
        
        // Icon-only (square)
        icon: "h-10 w-10",
        
        // Full width
        full: "h-10 w-full px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// =============================================================================
// Props Interface — Type-safe props
// =============================================================================

export interface [ComponentName]Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof [componentName]Variants> {
  /**
   * If true, shows a loading spinner
   */
  loading?: boolean;
  /**
   * Optional icon to display before the text
   */
  leftIcon?: React.ReactNode;
  /**
   * Optional icon to display after the text
   */
  rightIcon?: React.ReactNode;
}

// =============================================================================
// Component — Main implementation
// =============================================================================

export function [ComponentName]({
  className,
  variant,
  size,
  loading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: [ComponentName]Props) {
  return (
    <button
      className={cn(
        [componentName]Variants({ variant, size, className })
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Spinner className="mr-2 h-4 w-4" />
      )}
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
}

// =============================================================================
// Sub-components (if needed)
// =============================================================================

/**
 * Icon-only variant for actions like close, menu
 */
export function [ComponentName]Icon({
  className,
  ...props
}: Omit<[ComponentName]Props, "leftIcon" | "rightIcon" | "children">) {
  return (
    <[ComponentName]
      variant="ghost"
      size="icon"
      className={className}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </[ComponentName>
  );
}

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * // Basic usage
 * <[ComponentName]>Click me</[ComponentName]>
 * 
 * // With variant
 * <[ComponentName] variant="destructive">Delete</[ComponentName]>
 * 
 * // With size
 * <[ComponentName] size="lg">Large button</[ComponentName]>
 * 
 * // Loading state
 * <[ComponentName] loading>Saving...</[ComponentName]>
 * 
 * // With icons
 * <[ComponentName] leftIcon={<SaveIcon />}>Save</[ComponentName]>
 * 
 * // Icon only
 * <[ComponentName]Icon aria-label="Close" />
 */

// =============================================================================
// Spinner Helper (if not using a library)
// =============================================================================

function Spinner({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn("animate-spin h-4 w-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// =============================================================================
// Icon Helper (replace with your icon)
// =============================================================================

function Icon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2v20M2 12h20" />
    </svg>
  );
}
