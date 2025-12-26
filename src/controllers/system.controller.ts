import type { FastifyReply, FastifyRequest } from 'fastify';

import { HealthService } from '../services/health.service';

export class SystemController {
  private readonly healthService = new HealthService();

  root = async () => {
    return { hello: 'world', stack: 'Fastify + TypeScript' };
  };

  health = async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      await this.healthService.checkDatabase();

      return {
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        database: 'ok',
      };
    } catch (error) {
      return reply.status(500).send({
        status: 'error',
        uptime: Math.floor(process.uptime()),
        database: 'error',
      });
    }
  };
}
