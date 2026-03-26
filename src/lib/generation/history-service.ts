import type {
  PrismaClient,
  Skill,
  ComponentGeneration,
  Prisma,
} from "@prisma/client";

import { db } from "@/lib/db";

type GenerationRecord = ComponentGeneration & {
  selectedSkills: Array<{
    skill: Skill;
  }>;
};

export async function getPublishedSkills(
  skillIds: string[],
  prisma: PrismaClient = db,
) {
  return prisma.skill.findMany({
    where: {
      id: {
        in: skillIds,
      },
      publishStatus: "PUBLISHED",
    },
  });
}

export async function saveGeneration(
  {
    userId,
    componentType,
    model,
    promptSnapshot,
    resultCode,
    previewMarkup,
    rationale,
    selectedSkillIds,
  }: {
    userId: string;
    componentType: string;
    model: string;
    promptSnapshot: Prisma.InputJsonObject;
    resultCode: string;
    previewMarkup: string;
    rationale: string;
    selectedSkillIds: string[];
  },
  prisma: PrismaClient = db,
) {
  return prisma.componentGeneration.create({
    data: {
      userId,
      componentType,
      model,
      promptSnapshot,
      resultCode,
      previewPayload: {
        html: previewMarkup,
      } satisfies Prisma.InputJsonObject,
      rationale,
      selectedSkills: {
        create: selectedSkillIds.map((skillId) => ({
          skillId,
        })),
      },
    },
    include: {
      selectedSkills: {
        include: {
          skill: true,
        },
      },
    },
  });
}

export async function listGenerationsForUser(
  userId: string,
  prisma: PrismaClient = db,
) {
  return prisma.componentGeneration.findMany({
    where: { userId },
    include: {
      selectedSkills: {
        include: {
          skill: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getGenerationForUser(
  generationId: string,
  userId: string,
  prisma: PrismaClient = db,
) {
  return prisma.componentGeneration.findFirst({
    where: {
      id: generationId,
      userId,
    },
    include: {
      selectedSkills: {
        include: {
          skill: true,
        },
      },
    },
  }) as Promise<GenerationRecord | null>;
}
