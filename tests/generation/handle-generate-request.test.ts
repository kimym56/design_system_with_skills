import { expect, test, vi } from "vitest";

import { handleGenerateRequest } from "@/lib/generation/handle-generate-request";

test("guest generation requests succeed without a user session", async () => {
  const getQuotaStatus = vi.fn(async () => ({
    allowed: false,
    remaining: 0,
    limit: 5,
    usedToday: 5,
    actorId: "guest_123",
    isUnlimited: false,
  }));
  const recordUsage = vi.fn(async () => undefined);

  const response = await handleGenerateRequest(
    {
      componentType: "Button",
      skillIds: ["skill_1"],
    },
    {
      resolveActor: async () => ({
        actor: {
          type: "guest",
          guestId: "guest_123",
          isNewGuest: false,
        },
        cookieToSet: null,
      }),
      getQuotaStatus,
      getSkills: async () => [
        {
          id: "skill_1",
          name: "Editorial Skill",
          styleCues: ["crisp", "quiet"],
        },
      ],
      recordUsage,
      generateComponent: async () => ({
        componentName: "Button",
        code: 'export function Button(){ return <button>OK</button>; }',
        previewMarkup: "<button>OK</button>",
        rationale: "Uses selected skill.",
      }),
      saveGeneration: async () => ({
        id: "generation_123",
      }),
    },
  );

  expect(response.status).toBe(200);
  expect(getQuotaStatus).not.toHaveBeenCalled();
  expect(recordUsage).not.toHaveBeenCalled();
});
