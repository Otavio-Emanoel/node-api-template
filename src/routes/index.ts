import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { systemRoutes } from './system.routes';
import { usersRoutes } from './users.routes';

export const registerRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  await app.register(systemRoutes);
  await app.register(usersRoutes);
};
