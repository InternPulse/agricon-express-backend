// src/prisma/client.ts
import { PrismaClient } from "@prisma/client";

// Avoid multiple instances in dev environments (like hot-reloading)
declare global {
  // Allows global.prisma to be typed properly
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["error", "warn"], // optional: helpful for debugging
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
