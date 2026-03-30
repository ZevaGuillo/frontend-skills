# Rule: Dependent Validation

> Validate fields that depend on other field values. Common case: "confirm password" must match "password".

## Why It Matters

- **Data integrity** — Ensure related fields are consistent
- **UX** — Catch errors early
- **Security** — Password confirmation prevents typos

---

## Pattern 1: Confirm Password

```typescript
// forms/auth/register.schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase')
    .regex(/[0-9]/, 'Password must contain number'),
  
  // Confirm password - must match password
  confirmPassword: z.string(),
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }
);

export type RegisterFormData = z.infer<typeof registerSchema>;
```

---

## Pattern 2: Date Range Validation

```typescript
// Date range: end must be after start
export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
}).refine(
  data => new Date(data.endDate) > new Date(data.startDate),
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

// Price range: max must be >= min
export const priceRangeSchema = z.object({
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
}).refine(
  data => {
    if (data.minPrice && data.maxPrice) {
      return data.maxPrice >= data.minPrice;
    }
    return true;
  },
  {
    message: 'Maximum price must be greater than minimum price',
    path: ['maxPrice'],
  }
);
```

---

## Pattern 3: Conditional Required

```typescript
// Field required based on another field's value
export const subscriptionSchema = z.object({
  plan: z.enum(['free', 'basic', 'premium']),
  
  // Only required for premium
  paymentMethodId: z.string().optional(),
  
  // Credit card fields - required for paid plans
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
}).refine(
  data => {
    if (data.plan !== 'free') {
      return !!data.paymentMethodId && !!data.cardNumber;
    }
    return true;
  },
  {
    message: 'Payment details required for premium plans',
    path: ['paymentMethodId'],
  }
);
```

---

## Pattern 4: Async Dependent Validation

```typescript
// Check if email is already taken (async)
export const registerSchema = z.object({
  email: z.string().email(),
  
  // This would need custom async validation in useForm
  // or a custom resolver
});

// Custom async validation
const checkEmailAvailable = async (email: string) => {
  const response = await fetch(`/api/users/check-email?email=${email}`);
  const data = await response.json();
  return data.available;
};

// In useForm:
const form = useForm({
  // ... resolver
});

// Custom field validation
<FormField
  name="email"
  rules={{
    validate: async (value) => {
      const available = await checkEmailAvailable(value);
      return available || 'Email already taken';
    }
  }}
/>
```

---

## Pattern 5: Cross-Field Validation with SuperRefine

```typescript
// Complex cross-field validation
export const complexSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional(),
}).superRefine((data, ctx) => {
  // Custom: if username contains email prefix, that's suspicious
  if (data.email.includes('@') && data.username.includes(data.email.split('@')[0])) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Username cannot be derived from email',
      path: ['username'],
    });
  }
  
  // Phone required if no email
  if (!data.email && !data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Either email or phone is required',
      path: ['phone'],
    });
  }
});
```

---

## Component Implementation

```tsx
function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const password = form.watch('password');

  return (
    <Form {...form}>
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Show confirm password only when password has value */}
      {password && password.length >= 8 && (
        <FormField
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </Form>
  );
}
```

---

## Real-World: Shipping vs Billing

```typescript
export const checkoutSchema = z.object({
  // Shipping
  shippingName: z.string().min(1),
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingZip: z.string().min(1),
  
  // Billing (checkbox determines if shown)
  useSameAddress: z.boolean().default(true),
  billingName: z.string().optional(),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingZip: z.string().optional(),
}).refine(
  data => {
    if (!data.useSameAddress) {
      return (
        data.billingName &&
        data.billingAddress &&
        data.billingCity &&
        data.billingZip
      );
    }
    return true;
  },
  {
    message: 'Billing address required if different from shipping',
    path: ['billingName'],
  }
);
```

---

## Best Practices

1. **Use Zod .refine()** — For simple cross-field validation
2. **Use .superRefine()** — For complex validation with multiple issues
3. **Clear error messages** — Tell user what's wrong
4. **Test schemas** — Validate edge cases
5. **Consider performance** — Async validation impacts UX

---

## References

- SKILL.md: Forms overview
- `rules/conditional-fields.md`: Conditional UI
- `rules/field-level-validation.md`: Validation timing
