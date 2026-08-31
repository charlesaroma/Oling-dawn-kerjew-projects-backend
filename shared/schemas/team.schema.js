import { z } from 'zod';

const teamFields = {
  name: z.string().trim().min(1),
  role: z.string().trim().optional(),
  photo: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().optional(),
};

export const teamMemberSchema = z.object(teamFields);
export const teamMemberUpdateSchema = z.object(teamFields).partial();
