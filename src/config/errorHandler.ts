import type { FastifyInstance } from 'fastify';

export interface ErrorResponse {
  message: string;
  code?: string;
}

/**
 * Security: Global error handler para não expor informações sensíveis
 * Registra erros internos mas retorna mensagens genéricas ao cliente
 */
export function setupErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    // Log detalhado para debugging (apenas para admins/desenvolvedores)
    request.log.error({
      err: error,
      url: request.url,
      method: request.method,
    });

    // Não expor detalhes internos em produção
    const statusCode = error.statusCode || 500;
    const message =
      statusCode === 500 ? 'Erro interno do servidor' : error.message || 'Erro desconhecido';

    reply.status(statusCode).send({ message } as ErrorResponse);
  });
}
