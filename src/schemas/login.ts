import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1).email(),
  password: z.string().min(4),
});

export type LoginInput = z.infer<typeof loginSchema>;