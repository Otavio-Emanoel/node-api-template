import Fastify, { type FastifyInstance } from 'fastify';

import { registerRoutes } from './routes/index';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  });

  await app.register(registerRoutes);

  return app;
}
