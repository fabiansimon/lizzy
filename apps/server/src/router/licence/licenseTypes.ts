import { z } from 'zod';

export const CreateLicenseInput = z.object({
  title: z.string(),
  price: z.number(),
  metaURI: z.string().optional(),
  duration: z.number(),
});

export const License = z.object({
  id: z.number(),
  title: z.string(),
  vendor: z.string(),
  metaURI: z.string().optional(),
  price: z.string(), // formatted ETH as string
  issuedAt: z.string(), // ISO date string
  duration: z.number(),
  revoked: z.boolean(),
});

export type CreateLicenseInput = z.infer<typeof CreateLicenseInput>;
export type License = z.infer<typeof License>;
