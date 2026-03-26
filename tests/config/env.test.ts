import { expect, test } from "vitest";
import { envSchema } from "@/lib/env";

test("env schema requires the OpenAI, GitHub, Google, and database settings", () => {
  const result = envSchema.safeParse({});

  expect(result.success).toBe(false);
});
