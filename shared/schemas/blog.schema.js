import { z } from 'zod';

const blogFields = {
  title: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().optional(),
  coverImage: z.string().trim().optional(),
  author: z.string().trim().optional(),
  publishedAt: z.coerce.date().optional(),
  publishStatus: z.enum(['draft', 'published']).optional(),
  tags: z.array(z.string()).optional(),
  content: z.array(z.string()).optional(),
};

export const blogSchema = z.object(blogFields);
export const blogUpdateSchema = z.object(blogFields).partial();
