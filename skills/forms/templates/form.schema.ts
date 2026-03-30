/**
 * Form Schema Template
 * 
 * Zod schema with validator adapter
 * Keep in separate file: forms/[entity]/schema.ts
 * 
 * Replace: [Entity] → Product, User, Order (PascalCase)
 * Replace: [entity] → product, user, order (camelCase)
 */

import { z } from 'zod';

// =============================================================================
// Validator Adapter Interface (for future validators)
// =============================================================================

/**
 * Generic validator interface
 * Implement this for Yup, Joi, or custom validators
 */
export interface Validator<T> {
  parse: (data: unknown) => T;
  safeParse: (data: unknown) => {
    success: boolean;
    data?: T;
    error?: {
      message: string;
      issues?: { path: (string | number)[]; message: string }[];
    };
  };
}

/**
 * Creates a Zod-backed validator
 * This is the default validator
 */
export function createZodValidator<T>(schema: z.ZodSchema<T>): Validator<T> {
  return {
    parse: (data: unknown): T => {
      return schema.parse(data);
    },
    safeParse: (data: unknown) => {
      const result = schema.safeParse(data);
      if (result.success) {
        return { success: true, data: result.data };
      }
      return {
        success: false,
        error: {
          message: result.error.message,
          issues: result.error.issues.map(issue => ({
            path: issue.path,
            message: issue.message,
          })),
        },
      };
    },
  };
}

// =============================================================================
// Base Schema
// =============================================================================

export const create[Entity]Schema = z.object({
  // Required string
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  // Email
  email: z
    .string()
    .email('Invalid email address'),

  // Optional string
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  // Number
  price: z
    .number({ invalid_type_error: 'Price is required' })
    .positive('Price must be positive')
    .min(0.01, 'Minimum price is $0.01')
    .max(999999.99, 'Maximum price is $999,999.99'),

  // Enum
  status: z
    .enum(['draft', 'published', 'archived'])
    .default('draft'),

  // Boolean
  isActive: z
    .boolean()
    .default(true),

  // Date string
  expiresAt: z
    .string()
    .datetime('Invalid date format')
    .optional()
    .or(z.literal('')),
});

// =============================================================================
// Update Schema (partial of create)
// =============================================================================

export const update[Entity]Schema = create[Entity]Schema.partial();

// =============================================================================
// Filter Schema (for search/filter forms)
// =============================================================================

export const [entity]FiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// =============================================================================
// Dependent Validation Examples
// =============================================================================

// Example: Password confirmation
export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Example: Date range
export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Example: Conditional required
export const subscriptionSchema = z.object({
  plan: z.enum(['free', 'basic', 'premium']),
  paymentMethodId: z.string().optional(),
  cardNumber: z.string().optional(),
}).refine(
  data => {
    if (data.plan !== 'free') {
      return !!data.paymentMethodId && !!data.cardNumber;
    }
    return true;
  },
  {
    message: 'Payment details required for paid plans',
    path: ['paymentMethodId'],
  }
);

// =============================================================================
// Discriminated Union (for conditional fields)
// =============================================================================

export const paymentSchema = z.discriminatedUnion('paymentMethod', [
  z.object({
    paymentMethod: z.literal('credit_card'),
    cardNumber: z.string().min(16).max(16, 'Invalid card number'),
    cvv: z.string().min(3).max(4),
  }),
  z.object({
    paymentMethod: z.literal('paypal'),
    paypalEmail: z.string().email('Invalid PayPal email'),
  }),
  z.object({
    paymentMethod: z.literal('cash'),
  }),
]);

// =============================================================================
// Type Exports
// =============================================================================

export type Create[Entity]FormData = z.infer<typeof create[Entity]Schema>;
export type Update[Entity]FormData = z.infer<typeof update[Entity]Schema>;
export type [Entity]Filters = z.infer<typeof [entity]FiltersSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type DateRangeFormData = z.infer<typeof dateRangeSchema>;
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;

// =============================================================================
// Default Validator (Zod)
// =============================================================================

export const [entity]Validator = createZodValidator(create[Entity]Schema);

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * // In useForm:
 * import { zodResolver } from '@hookform/resolvers/zod';
 * 
 * const form = useForm({
 *   resolver: zodResolver(create[Entity]Schema),
 *   mode: 'onBlur',
 * });
 * 
 * // For custom validation:
 * const validator = createZodValidator(create[Entity]Schema);
 * const result = validator.safeParse(formData);
 * if (!result.success) {
 *   // Handle errors
 * }
 */
