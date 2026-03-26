import { expect, test } from "vitest";

import {
  canCreateGeneration,
  getQuotaBucketDate,
} from "@/lib/generation/quota-service";

test("users with five generations already used cannot create another one", async () => {
  const result = await canCreateGeneration({
    userId: "user_123",
    usedToday: 5,
  });

  expect(result.allowed).toBe(false);
  expect(result.remaining).toBe(0);
});

test("quota bucket date snaps to the UTC day boundary", () => {
  const bucket = getQuotaBucketDate(new Date("2026-03-27T13:47:12.000Z"));

  expect(bucket.toISOString()).toBe("2026-03-27T00:00:00.000Z");
});
