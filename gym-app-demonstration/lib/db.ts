import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Prevent multiple instances of Prisma Client in development.
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPgPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing. Add it to .env or .env.local.");
  }

  return new Pool({ connectionString });
}

const globalForPg = globalThis as unknown as { pgPool?: Pool };
const pgPool = globalForPg.pgPool ?? createPgPool();
if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pgPool;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
  adapter: new PrismaPg(pgPool),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
