import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      name: string;
      email: string;
      role: 'USER' | 'ADMIN';
    };

    user: {
      name: string;
      email: string;
      role: 'USER' | 'ADMIN';
      sub: string;
      iat: number;
      exp: number;
    };
  }
}
