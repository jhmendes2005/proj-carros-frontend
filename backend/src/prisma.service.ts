import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prismaGlobal = globalThis as typeof globalThis & { carrosPrisma?: PrismaClient };

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
    if (prismaGlobal.carrosPrisma) return prismaGlobal.carrosPrisma as PrismaService;
    prismaGlobal.carrosPrisma = this;
  }
}
