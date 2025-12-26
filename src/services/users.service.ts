import { prisma } from '../config/prisma';
import { Prisma } from '../generated/prisma';
import { hashPassword } from '../utils/password';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
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

  async getProfileById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateUser(userId: string, input: UpdateUserInput) {
    try {
      const data: { name?: string; email?: string; password?: string } = {};

      if (typeof input.name === 'string') {
        data.name = input.name.trim();
      }

      if (typeof input.email === 'string') {
        data.email = input.email.trim().toLowerCase();
      }

      if (typeof input.password === 'string') {
        data.password = await hashPassword(input.password);
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          name: true,
          email: true,
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

        if (error.code === 'P2025') {
          throw new Error('USER_NOT_FOUND');
        }
      }

      throw error;
    }
  }
}