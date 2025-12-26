import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { UsersController } from '../controllers/users.controller';
import { authenticate, ensureSelfOrAdmin } from '../middlewares/auth';

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

  app.put(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        summary: 'Editar usuário',
        description: 'Permissões: o próprio usuário (sub == id) ou ADMIN.',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', minLength: 1 },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
          additionalProperties: false,
        },
        response: {
          200: {
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
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
            required: ['message'],
          },
          403: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
            required: ['message'],
          },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
            required: ['message'],
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
      preHandler: [authenticate, ensureSelfOrAdmin],
    },
    usersController.update,
  );
};
