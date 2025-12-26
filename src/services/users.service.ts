import { Prisma } from '@prisma/client';

import { prisma } from '../config/prisma';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export class UsersService {
  async createUser(input: CreateUserInput) {
    try {
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('EMAIL_ALREADY_IN_USE');
        }
      }

      throw error;
    }
  }
}
