import { prisma } from '../config/prisma';

export class HealthService {
  async checkDatabase(): Promise<void> {
    await prisma.$queryRaw`SELECT 1`;
  }
}
