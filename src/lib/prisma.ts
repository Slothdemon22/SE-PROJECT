import { PrismaClient } from "@prisma/client";
import { pusherServer } from "./pusher/server";

const createPrismaClient = () => {
  return new PrismaClient({
    log: ["query", "info", "warn", "error"],
  }).$extends({
    query: {
      notification: {
        async create({ args, query }) {
          const result = await query(args);
          // Trigger Pusher event in the background without blocking the query
          try {
            if (result && result.userId) {
              await pusherServer.trigger(`user-${result.userId}`, 'new-notification', result);
            }
          } catch (e) {
            console.error("Failed to trigger pusher event:", e);
          }
          return result;
        },
      },
    },
  });
};

const globalForPrisma = global as unknown as { prisma: ReturnType<typeof createPrismaClient> };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
