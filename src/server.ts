import { env } from './config/env';
import { buildApp } from './app';

const start = async () => {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`🚀 HTTP Server running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();