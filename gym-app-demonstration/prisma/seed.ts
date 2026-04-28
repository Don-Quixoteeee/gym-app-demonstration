import path from "node:path";
import crypto from "node:crypto";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Keep env loading consistent with prisma.config.ts
const root = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(root, ".env") });
dotenv.config({ path: path.join(root, ".env.local"), override: true });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing. Add it to .env or .env.local.");
}

const pool = new Pool({ connectionString: databaseUrl });

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

async function main() {
  const email = process.env.DEMO_LOGIN_EMAIL ?? "rob@launchpadphilly.org";
  const password = process.env.DEMO_LOGIN_PASSWORD ?? "password123";

  // Demo auth is env-based, but we seed a corresponding User row so the DB matches the story.
  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash: sha256(password),
    },
    update: {
      // Keep the hash in sync if the env password changes
      passwordHash: sha256(password),
    },
  });

  // Ensure there is at least one member to attach workouts to.
  await prisma.member.upsert({
    where: { email: "demo.member@gym.local" },
    create: {
      email: "demo.member@gym.local",
      fullName: "Demo Member",
      status: "ACTIVE",
    },
    update: {
      fullName: "Demo Member",
      status: "ACTIVE",
    },
  });

  console.log("Seed complete:");
  console.log(`- User: ${email}`);
  console.log(`- Member: demo.member@gym.local`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
  await pool.end();
    await prisma.$disconnect();
  });
