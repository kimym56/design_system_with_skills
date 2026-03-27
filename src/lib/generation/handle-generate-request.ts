import { z } from "zod";

import {
  applyGuestCookie,
  type RequestActor,
  resolveCurrentRequestActor,
} from "@/lib/auth/request-actor";
import { CORE_COMPONENT_TYPES } from "@/lib/catalog/component-types";
import { buildGenerationInput } from "@/lib/generation/build-generation-input";
import { generateComponentArtifact } from "@/lib/generation/openai-client";
import {
  getUserQuotaStatus,
  recordGenerationUsage,
} from "@/lib/generation/quota-service";
import { validateGeneratedCode } from "@/lib/generation/validate-generated-code";

const requestSchema = z.object({
  componentType: z.enum(CORE_COMPONENT_TYPES),
  skillIds: z.array(z.string().min(1)).min(1),
});

type SkillShape = {
  id: string;
  name: string;
  styleCues: string[];
  readmeSummary?: string | null;
};

type QuotaStatusShape = {
  allowed: boolean;
  remaining: number | null;
  limit: number | null;
  usedToday: number;
  actorId: string;
  isUnlimited: boolean;
};

type SaveGenerationInput =
  | {
      userId: string;
      guestId?: never;
      componentType: string;
      model: string;
      promptSnapshot: ReturnType<typeof buildGenerationInput>;
      resultCode: string;
      previewMarkup: string;
      rationale: string;
      selectedSkillIds: string[];
    }
  | {
      userId?: never;
      guestId: string;
      componentType: string;
      model: string;
      promptSnapshot: ReturnType<typeof buildGenerationInput>;
      resultCode: string;
      previewMarkup: string;
      rationale: string;
      selectedSkillIds: string[];
    };

type HandleGenerateRequestDependencies = {
  resolveActor: () => Promise<{
    actor: RequestActor;
    cookieToSet: string | null;
  }>;
  getQuotaStatus: (actorId: string) => Promise<QuotaStatusShape>;
  getSkills: (skillIds: string[]) => Promise<SkillShape[]>;
  generateComponent: (
    input: ReturnType<typeof buildGenerationInput>,
  ) => Promise<{
    componentName: string;
    code: string;
    previewMarkup: string;
    rationale: string;
  }>;
  recordUsage: (actorId: string) => Promise<unknown>;
  saveGeneration: (input: SaveGenerationInput) => Promise<unknown>;
};

const OPEN_ACCESS_MODE = true;

function getActorId(actor: RequestActor) {
  return actor.type === "user" ? actor.userId : actor.guestId;
}

function getUnlimitedQuotaStatus(actor: RequestActor): QuotaStatusShape {
  return {
    allowed: true,
    remaining: null,
    limit: null,
    usedToday: 0,
    actorId: getActorId(actor),
    isUnlimited: true,
  };
}

export async function handleGenerateRequest(
  body: unknown,
  dependencies: HandleGenerateRequestDependencies,
) {
  const { actor, cookieToSet } = await dependencies.resolveActor();

  const parsedBody = requestSchema.safeParse(body);
  if (!parsedBody.success) {
    return Response.json(
      { error: "Invalid generation request.", details: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  const actorId = getActorId(actor);
  const quota = OPEN_ACCESS_MODE
    ? getUnlimitedQuotaStatus(actor)
    : await dependencies.getQuotaStatus(actorId);

  if (!quota.allowed) {
    return Response.json(
      {
        error: "Daily generation quota exceeded.",
        quota,
      },
      { status: 429 },
    );
  }

  const skills = await dependencies.getSkills(parsedBody.data.skillIds);
  if (skills.length !== parsedBody.data.skillIds.length) {
    return Response.json(
      { error: "One or more selected skills are not available." },
      { status: 400 },
    );
  }

  const generationInput = buildGenerationInput({
    componentType: parsedBody.data.componentType,
    skills,
  });
  const generated = await dependencies.generateComponent(generationInput);
  const validation = validateGeneratedCode(generated.code);

  if (!validation.ok) {
    return Response.json(
      { error: "Generated code failed validation.", details: validation.errors },
      { status: 422 },
    );
  }

  const saved = await dependencies.saveGeneration({
    ...(actor.type === "user"
      ? { userId: actor.userId }
      : { guestId: actor.guestId }),
    componentType: parsedBody.data.componentType,
    model: "gpt-5.4",
    promptSnapshot: generationInput,
    resultCode: generated.code,
    previewMarkup: generated.previewMarkup,
    rationale: generated.rationale,
    selectedSkillIds: parsedBody.data.skillIds,
  });

  if (!OPEN_ACCESS_MODE) {
    await dependencies.recordUsage(actorId);
  }

  return applyGuestCookie(
    Response.json({
      generation: saved,
      quota,
    }),
    cookieToSet,
  );
}

export function createGenerateRequestDependencies() {
  return {
    resolveActor: resolveCurrentRequestActor,
    getQuotaStatus: async (actorId: string) => {
      const { db } = await import("@/lib/db");
      const quota = await getUserQuotaStatus(db, actorId);

      return {
        allowed: quota.allowed,
        remaining: quota.remaining,
        limit: quota.limit,
        usedToday: quota.usedToday,
        actorId,
        isUnlimited: false,
      };
    },
    getSkills: async (skillIds: string[]) => {
      const { db } = await import("@/lib/db");
      const { getPublishedSkills } = await import(
        "@/lib/generation/history-service"
      );
      return getPublishedSkills(skillIds, db);
    },
    generateComponent: generateComponentArtifact,
    recordUsage: async (actorId: string) => {
      const { db } = await import("@/lib/db");
      return recordGenerationUsage(db, actorId);
    },
    saveGeneration: async (input: SaveGenerationInput) => {
      const { db } = await import("@/lib/db");
      const { saveGeneration } = await import("@/lib/generation/history-service");
      return saveGeneration(input, db);
    },
  };
}
