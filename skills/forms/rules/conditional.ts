// Conditional Fields — LOAD: when user needs conditional UI
// ~20 lines → ~400 bytes

import { z } from 'zod';

// DISCRIMINATED UNION for conditional
export const paymentSchema = z.discriminatedUnion('method', [
  z.object({ method: z.literal('card'), cardNumber: z.string().min(16) }),
  z.object({ method: z.literal('paypal'), email: z.string().email() }),
  z.object({ method: z.literal('cash') }), // No extra fields
]);

// IN COMPONENT:
const method = watch('method');
{method === 'card' && <Field name="cardNumber" />}
{method === 'paypal' && <Field name="email" />}
