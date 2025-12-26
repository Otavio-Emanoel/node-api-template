import Fastify from 'fastify';
import { env } from './config/env';
import { prisma } from './config/prisma';

const app = Fastify({
  logger: true,
});

app.get('/', async () => {
  return { hello: 'world', stack: 'Fastify + TypeScript' };
});

app.get('/health', async (_request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      database: 'ok',
    };
  } catch (error) {
    app.log.error({ error }, 'Database healthcheck failed');
    return reply.status(500).send({
      status: 'error',
      uptime: Math.floor(process.uptime()),
      database: 'error',
    });
  }
});

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`🚀 HTTP Server running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();