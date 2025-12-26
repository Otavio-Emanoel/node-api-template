import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { UsersController } from '../controllers/users.controller';

export const usersRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const usersController = new UsersController();

  app.post('/users', usersController.create);
};
