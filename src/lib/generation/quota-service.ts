import type { PrismaClient } from "@prisma/client";

export const DAILY_GENERATION_LIMIT = 5;

type CanCreateGenerationInput = {
  userId: string;
  usedToday: number;
  limit?: number;
};

export function getQuotaBucketDate(date = new Date()) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export async function canCreateGeneration({
  userId,
  usedToday,
  limit = DAILY_GENERATION_LIMIT,
}: CanCreateGenerationInput) {
  const remaining = Math.max(limit - usedToday, 0);

  return {
    userId,
    allowed: usedToday < limit,
    remaining,
    limit,
    usedToday,
  };
}

export async function getUserQuotaStatus(
  prisma: PrismaClient,
  userId: string,
  now = new Date(),
) {
  const bucketDate = getQuotaBucketDate(now);
  const usage = await prisma.dailyUsage.findUnique({
    where: {
      userId_date: {
        userId,
        date: bucketDate,
      },
    },
  });

  return canCreateGeneration({
    userId,
    usedToday: usage?.usedCount ?? 0,
  });
}

export async function recordGenerationUsage(
  prisma: PrismaClient,
  userId: string,
  now = new Date(),
) {
  const bucketDate = getQuotaBucketDate(now);

  return prisma.dailyUsage.upsert({
    where: {
      userId_date: {
        userId,
        date: bucketDate,
      },
    },
    create: {
      userId,
      date: bucketDate,
      usedCount: 1,
    },
    update: {
      usedCount: {
        increment: 1,
      },
    },
  });
}
