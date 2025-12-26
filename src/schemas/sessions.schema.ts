import { z } from 'zod';

export const createSessionBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type CreateSessionBody = z.infer<typeof createSessionBodySchema>;
