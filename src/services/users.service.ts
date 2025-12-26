import { Prisma } from '@prisma/client';

import { prisma } from '../config/prisma';
import { hashPassword } from '../utils/password';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export class UsersService {
  async createUser(input: CreateUserInput) {
    try {
      const name = input.name.trim();
      const email = input.email.trim().toLowerCase();

      const passwordHash = await hashPassword(input.password);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          // @ts-ignore
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | string | undefined;
          const targets = Array.isArray(target) ? target : target ? [target] : [];

          if (targets.includes('email')) {
            throw new Error('EMAIL_ALREADY_IN_USE');
          }
        }
      }

      throw error;
    }
  }
}