import { z } from 'zod';

export const createUserBodySchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  password: z
    .string()
    .min(12, 'Senha deve ter no mínimo 12 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;

export const updateUserParamsSchema = z.object({
  id: z.string().min(1),
});

export const updateUserBodySchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    email: z.string().email().max(255).optional(),
    password: z
      .string()
      .min(12, 'Senha deve ter no mínimo 12 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
      .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  });

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
export type UpdateUserParams = z.infer<typeof updateUserParamsSchema>;
