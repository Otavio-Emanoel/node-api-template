import { z } from 'zod';

export const createUserBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;

export const updateUserParamsSchema = z.object({
  id: z.string().min(1),
});

export const updateUserBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  });

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
export type UpdateUserParams = z.infer<typeof updateUserParamsSchema>;
