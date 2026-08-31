import { z } from 'zod';

export const siteConfigSchema = z.object({
  orgName: z.string().trim().min(1),
  shortName: z.string().trim().optional(),
  tagline: z.string().trim().optional(),
  description: z.string().trim().optional(),
  emails: z.array(z.string()).optional(),
  phones: z.array(z.string()).optional(),
  registeredAddress: z.string().trim().optional(),
  postalAddress: z.string().trim().optional(),
  registeredYear: z.string().trim().optional(),
  navLinks: z.array(z.object({ label: z.string(), path: z.string() })).optional(),
  socialLinks: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
});
