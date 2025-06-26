import { PrismaClient } from '@prisma/client';
import { getLogger } from '../core/logging';

export const prisma = new PrismaClient(
  {
    log: ['query', 'info', 'warn', 'error'],
  },
);

export async function initializeData(): Promise<void> {
  getLogger().info('Opzetten van de connectie met de database');

  await prisma.$connect();

  getLogger().info('De connectie met de database is opgezet');
}

export async function shutdownData(): Promise<void> {
  getLogger().info('Database connectie aan het verbreken');

  await prisma?.$disconnect();

  getLogger().info('Database connectie gesloten');
}
