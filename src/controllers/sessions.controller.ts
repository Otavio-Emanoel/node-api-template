import type { FastifyReply, FastifyRequest } from 'fastify';

import { createSessionBodySchema } from '../schemas/sessions.schema';
import { SessionsService } from '../services/sessions.service';

export class SessionsController {
  private readonly sessionsService = new SessionsService();

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createSessionBodySchema.parse(request.body);

    try {
      const user = await this.sessionsService.authenticate(body);

      const token = await reply.jwtSign(
        {
          name: user.name,
          email: user.email,
          role: user.role,
        },
        {
          sub: user.id,
        },
      );

      return reply.status(200).send({ token });
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
        return reply.status(401).send({ message: 'Credenciais inválidas.' });
      }

      request.log.error({ error }, 'Create session failed');
      return reply.status(500).send({ message: 'Erro interno.' });
    }
  };
}
