import { config } from 'dotenv';
import path from 'path';

// Load environment variables explicitly in development/non-production environments
if (process.env.NODE_ENV !== 'production') {
  config({ path: path.resolve(process.cwd(), '.env.local') });
}

import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@/generated/prisma';
import ws from 'ws';

// Required for Neon serverless in environments without native WebSocket support
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL?.replace(/^"|"$/g, '');

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

if (!globalForPrisma.prisma) {
  if (!connectionString) {
    const errorMsg = "DATABASE_URL is not set. Please check your .env.local file.";
    console.error(`[Prisma] ${errorMsg}`);
    // We don't throw here to avoid crashing the entire app if this module is imported
    // in contexts where the DB isn't strictly needed immediately, but subsequent
    // calls to prisma will fail.
  } else {
    // Prisma 7: `PrismaNeon` is PrismaNeonAdapterFactory — pass PoolConfig, not a Pool instance.
    const adapter = new PrismaNeon({ connectionString });
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
}

export const prisma = globalForPrisma.prisma!;

