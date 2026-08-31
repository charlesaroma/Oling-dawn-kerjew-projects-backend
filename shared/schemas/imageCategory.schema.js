import { z } from 'zod';

export const imageCategorySchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const imageCategoryUpdateSchema = imageCategorySchema.partial();

export const reorderSchema = z.array(z.object({
  id: z.string(),
  sortOrder: z.coerce.number().int(),
}));
