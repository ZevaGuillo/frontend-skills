# Rule: Conditional Fields

> Show, hide, or make required fields based on other field values. Use discriminated unions or watch() for conditional logic.

## Why It Matters

- **UX** — Only show relevant fields
- **Validation** — Conditional required fields
- **Complexity** — Handle complex form logic cleanly

---

## Pattern 1: Watch + Conditional Render

```tsx
function PaymentForm() {
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'credit_card',
      cardNumber: '',
      paypalEmail: '',
    },
    mode: 'onBlur',
  });

  // Watch the payment method
  const paymentMethod = watch('paymentMethod');

  return (
    <Form {...form}>
      <FormField
        name="paymentMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Method</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {/* Conditional: Show only for credit_card */}
      {paymentMethod === 'credit_card' && (
        <FormField
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="1234567812345678" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Conditional: Show only for paypal */}
      {paymentMethod === 'paypal' && (
        <FormField
          name="paypalEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PayPal Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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

## Pattern 2: Discriminated Union Schema

```typescript
// Conditional schema using discriminatedUnion
export const paymentSchema = z.discriminatedUnion('paymentMethod', [
  z.object({
    paymentMethod: z.literal('credit_card'),
    cardNumber: z.string().min(16).max(16, 'Invalid card number'),
    cvv: z.string().min(3).max(4),
    expiryMonth: z.string().min(2).max(2),
    expiryYear: z.string().min(4).max(4),
  }),
  z.object({
    paymentMethod: z.literal('paypal'),
    paypalEmail: z.string().email('Invalid email'),
  }),
  z.object({
    paymentMethod: z.literal('cash'),
    // No additional fields needed
  }),
]);

export type PaymentFormData = z.infer<typeof paymentSchema>;
```

---

## Pattern 3: Optional Fields Based on Condition

```typescript
// Schema: shippingAddress is optional unless useDifferentBilling is true
export const checkoutSchema = z.object({
  useDifferentBilling: z.boolean().default(false),
  
  // These are optional by default
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingZip: z.string().optional(),
}).refine(
  data => {
    // If different billing, all billing fields required
    if (data.useDifferentBilling) {
      return data.billingAddress && data.billingCity && data.billingZip;
    }
    return true;
  },
  {
    message: 'Billing address required when different from shipping',
    path: ['billingAddress'],
  }
);
```

---

## Pattern 4: Required Based on Another Field

```typescript
// "Other" field: only required when reason = "other"
export const reasonSchema = z.object({
  reason: z.enum(['bug', 'feature', 'support', 'other']),
  reasonOther: z.string().optional(),
}).refine(
  data => {
    if (data.reason === 'other') {
      return data.reasonOther && data.reasonOther.length > 0;
    }
    return true;
  },
  {
    message: 'Please specify your reason',
    path: ['reasonOther'],
  }
);
```

---

## Component with Conditional Required

```tsx
function FeedbackForm() {
  const form = useForm({
    resolver: zodResolver(reasonSchema),
    mode: 'onBlur',
  });

  const reason = form.watch('reason');

  return (
    <Form {...form}>
      <FormField
        name="reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reason</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {/* Show "Other" field when reason = other */}
      {reason === 'other' && (
        <FormField
          name="reasonOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please specify</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Describe your reason" />
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

## Pattern 5: Multi-Level Conditions

```typescript
// Country → State → City
export const addressSchema = z.object({
  country: z.string().min(1),
  state: z.string().optional(),
  city: z.string().optional(),
});

// In component:
const country = form.watch('country');
const showStates = ['US', 'CA', 'AU'].includes(country);
const showCities = showStates && form.watch('state');

return (
  <>
    <FormField name="country" ... />
    {showStates && <FormField name="state" ... />}
    {showCities && <FormField name="city" ... />}
  </>
);
```

---

## Reset Conditional Fields

```tsx
function PaymentForm() {
  const form = useForm({ /* ... */ });

  const paymentMethod = watch('paymentMethod');

  // Reset dependent fields when payment method changes
  React.useEffect(() => {
    if (paymentMethod !== 'credit_card') {
      form.setValue('cardNumber', '');
      form.setValue('cvv', '');
    }
    if (paymentMethod !== 'paypal') {
      form.setValue('paypalEmail', '');
    }
  }, [paymentMethod, form]);

  return <Form {...form}>...</Form>;
}
```

---

## Best Practices

1. **Use discriminated unions** — For complex conditional schemas
2. **Watch values** — For conditional rendering in UI
3. **Reset dependent fields** — When parent field changes
4. **Schema + UI** — Both should reflect conditions
5. **Accessibility** — Don't hide required fields from screen readers

---

## References

- SKILL.md: Forms overview
- `rules/dependent-validation.md`: Related field validation
- `rules/field-level-validation.md`: Validation timing
- `templates/form-fields.template.tsx`: Field templates
