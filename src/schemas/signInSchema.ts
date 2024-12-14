import * as z from 'zod';

export const signInSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"), // This can be either username or email
  password: z.string().min(6, "Password must be at least 6 characters"),
});
