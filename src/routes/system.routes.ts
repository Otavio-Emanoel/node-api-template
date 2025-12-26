import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { SystemController } from '../controllers/system.controller';

export const systemRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const systemController = new SystemController();

  app.get(
    '/',
    {
      schema: {
        tags: ['System'],
        summary: 'Root endpoint',
        response: {
          200: {
            type: 'object',
            properties: {
              hello: { type: 'string' },
              stack: { type: 'string' },
            },
            required: ['hello', 'stack'],
          },
        },
      },
    },
    systemController.root,
  );

  app.get(
    '/health',
    {
      schema: {
        tags: ['System'],
        summary: 'Healthcheck (API + DB)',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              uptime: { type: 'number' },
              database: { type: 'string' },
            },
            required: ['status', 'uptime', 'database'],
          },
          500: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              uptime: { type: 'number' },
              database: { type: 'string' },
            },
            required: ['status', 'uptime', 'database'],
          },
        },
      },
    },
    systemController.health,
  );
};
