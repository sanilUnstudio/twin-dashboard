import { PrismaClient } from '@prisma/client';

// Read client
const readClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_READ,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Write client
const writeClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_WRITE,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const prismaRead = readClient;
export const prismaWrite = writeClient;