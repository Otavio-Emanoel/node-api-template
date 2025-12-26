import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { UsersController } from '../controllers/users.controller';

export const usersRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const usersController = new UsersController();

  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: 'Cadastrar usuário',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
          required: ['name', 'email', 'password'],
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string', enum: ['USER', 'ADMIN'] },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
            required: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
          },
          409: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
            required: ['message'],
          },
        },
      },
    },
    usersController.create,
  );
};
