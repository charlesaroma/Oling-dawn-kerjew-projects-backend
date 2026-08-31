import { z } from 'zod';

const projectFields = {
  title: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  category: z.string().trim().min(1),
  location: z.string().trim().optional(),
  status: z.string().trim().optional(),
  publishStatus: z.enum(['draft', 'published']).optional(),
  year: z.coerce.number().int(),
  summary: z.string().trim().optional(),
  description: z.array(z.string()).optional(),
  coverImage: z.string().trim().optional(),
  gallery: z.array(z.string()).optional(),
  video: z.string().trim().nullable().optional(),
};

export const projectSchema = z.object(projectFields);
export const projectUpdateSchema = z.object(projectFields).partial();
