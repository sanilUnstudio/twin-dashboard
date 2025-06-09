import { PrismaClient } from '@prisma/client';

// Read client
const readClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_READ,
    },
  },
  log: [],
});

// Write client
const writeClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_WRITE,
    },
  },
  log: [],
});

export const prismaRead = readClient;
export const prismaWrite = writeClient;