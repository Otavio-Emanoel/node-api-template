import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { systemRoutes } from './system.routes';

export const registerRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  await app.register(systemRoutes);
};
