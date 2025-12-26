import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { SystemController } from '../controllers/system.controller';

export const systemRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const systemController = new SystemController();

  app.get('/', systemController.root);
  app.get('/health', systemController.health);
};
