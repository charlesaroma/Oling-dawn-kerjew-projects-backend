import { z } from 'zod';

export const updateAccountSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
});
