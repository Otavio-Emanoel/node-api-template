import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { SessionsController } from '../controllers/sessions.controller';

export const sessionsRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const sessionsController = new SessionsController();

  app.post(
    '/sessions',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Login (gera JWT)',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 1 },
          },
          required: ['email', 'password'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
            },
            required: ['token'],
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
            required: ['message'],
          },
        },
      },
    },
    sessionsController.create,
  );

  app.get(
    '/me',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Perfil do usuário logado',
        security: [{ bearerAuth: [] }],
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
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
            required: ['message'],
          },
        },
      },
    },
    sessionsController.me,
  );
};
