import Fastify, { type FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { registerRoutes } from './routes/index';
import { env } from './config/env';
import { setupErrorHandler } from './config/errorHandler';
import { sanitizer } from './middlewares/sanitizer';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
    trustProxy: true,
  });

  // Security: Helmet para proteção de headers HTTP
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  // Security: CORS com restrições
  await app.register(cors, {
    origin: env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Security: Rate limiting para proteger contra brute force
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: '7d',
    },
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Node API Template',
        description: 'API Fastify + Prisma + TypeScript',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  await app.register(registerRoutes);

  // Security: Registrar sanitizer middleware
  app.addHook('onRequest', sanitizer);

  // Security: Registrar global error handler
  setupErrorHandler(app);

  return app;
}
