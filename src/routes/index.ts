import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { sessionsRoutes } from './sessions.routes';
import { systemRoutes } from './system.routes';
import { usersRoutes } from './users.routes';

export const registerRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  await app.register(sessionsRoutes);
  await app.register(systemRoutes);
  await app.register(usersRoutes);
};
