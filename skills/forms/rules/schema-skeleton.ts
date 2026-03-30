// Schema Skeleton — LOAD: only when creating/updating schema
// ~15 lines → ~300 bytes

import { z } from 'zod';

export const [entity]Schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  description: z.string().max(500).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});

export type [Entity]FormData = z.infer<typeof [entity]Schema>;

// UPDATE variant
export const update[Entity]Schema = [entity]Schema.partial();
export type Update[Entity]FormData = z.infer<typeof update[Entity]Schema>;
