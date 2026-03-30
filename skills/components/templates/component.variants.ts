/**
 * Component Variants Template
 * 
 * Reusable variants using class-variance-authority (cva)
 * Type-safe, autocomplete-enabled variant system
 * 
 * Replace: [componentName] with your component name
 * Replace: variant/size options as needed
 */

import { cva, type VariantProps } from "class-variance-authority";

/**
 * =============================================================================
 * Button Variants — Most common example
 * =============================================================================
 */
export const buttonVariants = cva(
  // Base classes — always applied
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary brand action
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        
        // Destructive/error actions  
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        
        // Outlined style
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        
        // Secondary/alternative
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        // Ghost/subtle
        ghost: "hover:bg-accent hover:text-accent-foreground",
        
        // Link/text only
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Default
        default: "h-10 px-4 py-2",
        
        // Small
        sm: "h-9 rounded-md px-3",
        
        // Large
        lg: "h-11 rounded-md px-8",
        
        // Icon only (square)
        icon: "h-10 w-10",
        
        // Full width
        full: "w-full h-10 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * =============================================================================
 * Badge Variants — Status indicators
 * =============================================================================
 */
export const badgeVariants = cva(
  // Base classes
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Default (primary)
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        
        // Secondary
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        // Destructive
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        
        // Outline/neutral
        outline: "text-foreground",
        
        // Custom status
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * =============================================================================
 * Card Variants
 * =============================================================================
 */
export const cardVariants = cva(
  // Base classes
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2 border-primary",
        ghost: "border-transparent bg-muted",
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

/**
 * =============================================================================
 * Input Variants
 * =============================================================================
 */
export const inputVariants = cva(
  // Base classes
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        default: "h-10 px-3",
        lg: "h-12 px-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * =============================================================================
 * Alert Variants
 * =============================================================================
 */
export const alertVariants = cva(
  // Base classes
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-green-500/50 text-green-700 dark:text-green-300 [&>svg]:text-green-600",
        warning: "border-yellow-500/50 text-yellow-700 dark:text-yellow-300 [&>svg]:text-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * =============================================================================
 * Usage with Component
 * =============================================================================
 * 
 * // button.tsx
 * import { cva, type VariantProps } from "class-variance-authority";
 * import { cn } from "@/lib/utils";
 * 
 * const buttonVariants = cva(...); // paste variants above
 * 
 * interface ButtonProps 
 *   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
 *     VariantProps<typeof buttonVariants> {}
 * 
 * export function Button({ className, variant, size, ...props }: ButtonProps) {
 *   return (
 *     <button 
 *       className={cn(buttonVariants({ variant, size }), className)}
 *       {...props}
 *     />
 *   );
 * }
 * 
 * // Usage — full TypeScript autocomplete!
 * <Button variant="default" size="lg" /> // Works
 * <Button variant="invalid" /> // TypeScript error!
 */

/**
 * =============================================================================
 * Type Exports for External Use
 * =============================================================================
 */

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type BadgeVariants = VariantProps<typeof badgeVariants>;
export type CardVariants = VariantProps<typeof cardVariants>;
export type InputVariants = VariantProps<typeof inputVariants>;
export type AlertVariants = VariantProps<typeof alertVariants>;

/**
 * =============================================================================
 * Advanced: Compound Variants
 * =============================================================================
 * 
 * You can combine variants for specific combinations:
 */
export const advancedButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
      },
      loading: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    compoundVariants: [
      // Apply both variant and size together
      {
        variant: "outline",
        size: "sm",
        className: "text-xs",
      },
      // Apply when loading
      {
        loading: true,
        className: "pointer-events-none",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
);

/**
 * =============================================================================
 * Dark Mode Support
 * =============================================================================
 * 
 * Variants automatically work with dark mode when using:
 * - Tailwind's dark: prefix
 * - CSS custom properties (shadcn approach)
 * 
 * Example:
 * const buttonVariants = cva(
 *   "bg-primary text-primary-foreground dark:bg-primary-foreground dark:text-primary",
 *   ...
 * );
 */
