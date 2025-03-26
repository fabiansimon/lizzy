import { z } from 'zod';

export const CreateLicenseInput = z.object({
  title: z.string(),
  price: z.number(),
  metaURI: z.string().optional(),
  duration: z.number(),
});

export type CreateLicenseInput = z.infer<typeof CreateLicenseInput>;
