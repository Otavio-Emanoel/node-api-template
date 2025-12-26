import type { FastifyReply, FastifyRequest } from 'fastify';

import {
  createUserBodySchema,
  updateUserBodySchema,
  updateUserParamsSchema,
} from '../schemas/users.schema';
import { UsersService } from '../services/users.service';

export class UsersController {
  private readonly usersService = new UsersService();

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createUserBodySchema.parse(request.body);

    try {
      const user = await this.usersService.createUser(body);
      return reply.status(201).send(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_ALREADY_IN_USE') {
        return reply.status(409).send({ message: 'Email já está em uso.' });
      }

      request.log.error({ error }, 'Create user failed');
      return reply.status(500).send({ message: 'Erro interno.' });
    }
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = updateUserParamsSchema.parse(request.params);
    const body = updateUserBodySchema.parse(request.body);

    try {
      const user = await this.usersService.updateUser(params.id, body);
      return reply.status(200).send(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_ALREADY_IN_USE') {
        return reply.status(409).send({ message: 'Email já está em uso.' });
      }

      if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
        return reply.status(404).send({ message: 'Usuário não encontrado.' });
      }

      request.log.error({ error }, 'Update user failed');
      return reply.status(500).send({ message: 'Erro interno.' });
    }
  };
}
