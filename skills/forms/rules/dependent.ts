// Dependent Validation — LOAD: when validating related fields
// ~15 lines → ~300 bytes

import { z } from 'zod';

// PASSWORD CONFIRM
export const passwordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(p => p.password === p.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// DATE RANGE
export const dateRangeSchema = z.object({
  start: z.string(),
  end: z.string(),
}).refine(d => new Date(d.end) > new Date(d.start), {
  message: 'End must be after start',
  path: ['end'],
});
