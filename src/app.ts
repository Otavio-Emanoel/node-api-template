import Fastify, { type FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';

import { registerRoutes } from './routes/index';
import { env } from './config/env';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: '7d',
    },
  });

  await app.register(registerRoutes);

  return app;
}
