import { prisma } from '../config/prisma';
import { verifyPassword } from '../utils/password';

type AuthenticateInput = {
  email: string;
  password: string;
};

export class SessionsService {
  async authenticate({ email, password }: AuthenticateInput) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
