import Fastify from 'fastify';
import { env } from './config/env';

const app = Fastify({
  logger: true,
});

app.get('/', async () => {
  return { hello: 'world', stack: 'Fastify + TypeScript' };
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