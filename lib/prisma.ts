// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // ✅ Prevent multiple Prisma instances in dev (Next.js hot reload)
  var prisma: PrismaClient | undefined;
}

// ✅ Create Prisma client safely
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"] // no "query" for cleaner output
        : ["error"],
    datasources: {
      db: {
        // ✅ Ensure SSL for Neon + Fallback to env
        url: process.env.DATABASE_URL?.includes("sslmode=")
          ? process.env.DATABASE_URL
          : `${process.env.DATABASE_URL}?sslmode=require`,
      },
    },
  });

// ✅ Keep Prisma instance across hot reloads (dev only)
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

// 🧠 Optional: helper for retrying transient Neon disconnects
export async function safeQuery<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err.code === "P1001" && i < retries - 1) {
        console.warn(`🔄 Neon connection retry (${i + 1}/${retries})...`);
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries reached");
}
