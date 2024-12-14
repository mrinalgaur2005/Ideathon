import { z } from 'zod';

export const verifySchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be exactly 6 characters")
    .regex(/^\d{6}$/, "Verification code must be a 6-digit string"), // Ensures the code is 6 digits (if you want it to be numeric)
});

export type Verification = z.infer<typeof verifySchema>;
