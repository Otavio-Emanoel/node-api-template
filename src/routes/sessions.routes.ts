import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { SessionsController } from '../controllers/sessions.controller';

export const sessionsRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const sessionsController = new SessionsController();

  app.post('/sessions', sessionsController.create);
};
