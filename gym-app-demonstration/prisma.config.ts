import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma ORM v7 reads connection URLs from `prisma.config.ts`.
// Be explicit about which env files we load so CLI commands work consistently.
const root = __dirname;

// Load `.env` first, then let `.env.local` override if present.
dotenv.config({ path: path.join(root, ".env") });
dotenv.config({ path: path.join(root, ".env.local"), override: true });

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is missing. Add it to .env (or .env.local) in the project root."
  );
}

// Security: modern pg-connection-string treats 'require'/'prefer' as aliases for
// 'verify-full' and will warn. To avoid the warning and be explicit about
// security guarantees, append sslmode=verify-full in production when the
// connection string doesn't already specify sslmode or uselibpqcompat.
function ensureSslMode(url: string) {
  if (/\b(sslmode|uselibpqcompat)=/i.test(url)) return url;
  if (process.env.NODE_ENV === "production") {
    return url + (url.includes("?") ? "&" : "?") + "sslmode=verify-full";
  }
  return url;
}

databaseUrl = ensureSslMode(databaseUrl);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
  url: databaseUrl,
  },
});
