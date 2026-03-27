import type {
  PrismaClient,
  Skill,
  ComponentGeneration,
  Prisma,
} from "@prisma/client";

import type { RequestActor } from "@/lib/auth/request-actor";
import { db } from "@/lib/db";

type GenerationRecord = ComponentGeneration & {
  selectedSkills: Array<{
    skill: Skill;
  }>;
};

type SaveGenerationOwnerInput =
  | {
      userId: string;
      guestId?: never;
    }
  | {
      userId?: never;
      guestId: string;
    };

export function buildGenerationOwnerFilter(actor: RequestActor) {
  if (actor.type === "user") {
    return { userId: actor.userId };
  }

  return { guestId: actor.guestId };
}

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
    guestId,
    componentType,
    model,
    promptSnapshot,
    resultCode,
    previewMarkup,
    rationale,
    selectedSkillIds,
  }: {
    userId?: string;
    guestId?: string;
    componentType: string;
    model: string;
    promptSnapshot: Prisma.InputJsonObject;
    resultCode: string;
    previewMarkup: string;
    rationale: string;
    selectedSkillIds: string[];
  } & SaveGenerationOwnerInput,
  prisma: PrismaClient = db,
) {
  return prisma.componentGeneration.create({
    data: {
      userId,
      guestId,
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

export async function listGenerationsForActor(
  actor: RequestActor,
  prisma: PrismaClient = db,
) {
  return prisma.componentGeneration.findMany({
    where: buildGenerationOwnerFilter(actor),
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

export async function listGenerationsForUser(
  userId: string,
  prisma: PrismaClient = db,
) {
  return listGenerationsForActor(
    {
      type: "user",
      userId,
    },
    prisma,
  );
}

export async function getGenerationForActor(
  generationId: string,
  actor: RequestActor,
  prisma: PrismaClient = db,
) {
  return prisma.componentGeneration.findFirst({
    where: {
      id: generationId,
      ...buildGenerationOwnerFilter(actor),
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

export async function getGenerationForUser(
  generationId: string,
  userId: string,
  prisma: PrismaClient = db,
) {
  return getGenerationForActor(
    generationId,
    {
      type: "user",
      userId,
    },
    prisma,
  );
}
