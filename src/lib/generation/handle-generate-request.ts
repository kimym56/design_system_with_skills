import { z } from "zod";

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

type SessionShape = {
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
  };
} | null;

type SkillShape = {
  id: string;
  name: string;
  styleCues: string[];
  readmeSummary?: string | null;
};

type HandleGenerateRequestDependencies = {
  getSession: () => Promise<SessionShape>;
  getQuotaStatus: (userId: string) => Promise<{
    allowed: boolean;
    remaining: number;
    limit: number;
    usedToday: number;
    userId: string;
  }>;
  getSkills: (skillIds: string[]) => Promise<SkillShape[]>;
  generateComponent: (
    input: ReturnType<typeof buildGenerationInput>,
  ) => Promise<{
    componentName: string;
    code: string;
    previewMarkup: string;
    rationale: string;
  }>;
  recordUsage: (userId: string) => Promise<unknown>;
  saveGeneration: (input: {
    userId: string;
    componentType: string;
    model: string;
    promptSnapshot: ReturnType<typeof buildGenerationInput>;
    resultCode: string;
    previewMarkup: string;
    rationale: string;
    selectedSkillIds: string[];
  }) => Promise<unknown>;
};

export async function handleGenerateRequest(
  body: unknown,
  dependencies: HandleGenerateRequestDependencies,
) {
  const session = await dependencies.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const parsedBody = requestSchema.safeParse(body);
  if (!parsedBody.success) {
    return Response.json(
      { error: "Invalid generation request.", details: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  const quota = await dependencies.getQuotaStatus(userId);
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
    userId,
    componentType: parsedBody.data.componentType,
    model: "gpt-5.4",
    promptSnapshot: generationInput,
    resultCode: generated.code,
    previewMarkup: generated.previewMarkup,
    rationale: generated.rationale,
    selectedSkillIds: parsedBody.data.skillIds,
  });

  await dependencies.recordUsage(userId);

  return Response.json({
    generation: saved,
    quota: {
      ...quota,
      remaining: Math.max(quota.remaining - 1, 0),
      usedToday: quota.usedToday + 1,
    },
  });
}

export function createGenerateRequestDependencies() {
  return {
    getSession: async () => {
      const { getServerAuthSession } = await import("@/auth");
      return getServerAuthSession();
    },
    getQuotaStatus: async (userId: string) => {
      const { db } = await import("@/lib/db");
      return getUserQuotaStatus(db, userId);
    },
    getSkills: async (skillIds: string[]) => {
      const { db } = await import("@/lib/db");
      const { getPublishedSkills } = await import(
        "@/lib/generation/history-service"
      );
      return getPublishedSkills(skillIds, db);
    },
    generateComponent: generateComponentArtifact,
    recordUsage: async (userId: string) => {
      const { db } = await import("@/lib/db");
      return recordGenerationUsage(db, userId);
    },
    saveGeneration: async (input: {
      userId: string;
      componentType: string;
      model: string;
      promptSnapshot: ReturnType<typeof buildGenerationInput>;
      resultCode: string;
      previewMarkup: string;
      rationale: string;
      selectedSkillIds: string[];
    }) => {
      const { db } = await import("@/lib/db");
      const { saveGeneration } = await import("@/lib/generation/history-service");
      return saveGeneration(input, db);
    },
  };
}
