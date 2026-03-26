import { expect, test } from "vitest";

import { handleGenerateRequest } from "@/lib/generation/handle-generate-request";

test("generation handler rejects requests above the daily quota", async () => {
  const response = await handleGenerateRequest(
    {
      componentType: "Button",
      skillIds: ["skill_1"],
    },
    {
      getSession: async () => ({
        user: {
          id: "user_123",
          email: "person@example.com",
          name: "Person",
        },
      }),
      getQuotaStatus: async () => ({
        allowed: false,
        remaining: 0,
        limit: 5,
        usedToday: 5,
        userId: "user_123",
      }),
      getSkills: async () => [],
      recordUsage: async () => undefined,
      generateComponent: async () => {
        throw new Error("should not run");
      },
      saveGeneration: async () => {
        throw new Error("should not run");
      },
    },
  );

  expect(response.status).toBe(429);
});
