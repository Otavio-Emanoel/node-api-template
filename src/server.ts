import { env } from './config/env';
import { buildApp } from './app';

const start = async () => {
  const app = await buildApp();

  try {
    // Security: Bind apenas em localhost em desenvolvimento, em produção usar 127.0.0.1 ou com reverse proxy
    const host = env.NODE_ENV === 'production' ? '127.0.0.1' : 'localhost';
    await app.listen({ port: env.PORT, host });
    console.log(`🚀 HTTP Server running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();