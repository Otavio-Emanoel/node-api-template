import type { FastifyReply, FastifyRequest, preHandlerHookHandler } from 'fastify';

type ErrorBody = { message: string };

type ParamsWithId = {
  id?: string;
};

export const authenticate: preHandlerHookHandler = async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    request.log.error({ error }, 'JWT verification failed');
    return reply.status(401).send({ message: 'Não autorizado.' } satisfies ErrorBody);
  }
};

export const ensureSelfOrAdmin: preHandlerHookHandler = async (request, reply) => {
  const params = request.params as ParamsWithId;
  const targetUserId = params?.id;

  if (!targetUserId) {
    return reply.status(400).send({ message: 'Parâmetro "id" é obrigatório.' } satisfies ErrorBody);
  }

  const requesterId = request.user.sub;
  const requesterRole = request.user.role;

  const allowed = requesterRole === 'ADMIN' || requesterId === targetUserId;
  if (!allowed) {
    return reply
      .status(403)
      .send({ message: 'Você não tem permissão para editar este usuário.' } satisfies ErrorBody);
  }
};
