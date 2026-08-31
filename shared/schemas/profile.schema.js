import { z } from 'zod';

const profileFields = {
  fullName: z.string().trim().min(1),
  category: z.string().trim().min(1),
  gender: z.string().trim().min(1),
  age: z.coerce.number().int().positive().nullable().optional(),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  nin: z.string().trim().optional(),
  passportNumber: z.string().trim().optional(),
  associatedProject: z.string().trim().optional(),
  photo: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  registeredDate: z.coerce.date().optional(),
};

const hasIdRefinement = (data) => Boolean(data.nin?.trim()) || Boolean(data.passportNumber?.trim());
const idRefinementOpts = { message: 'Provide either a NIN or a passport number.', path: ['nin'] };

export const profileSchema = z.object(profileFields).refine(hasIdRefinement, idRefinementOpts);
export const profileUpdateSchema = z.object(profileFields).partial();
