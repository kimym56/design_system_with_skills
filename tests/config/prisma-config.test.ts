import { afterEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_DATABASE_URL } from "../../prisma.config";

const ORIGINAL_DATABASE_URL = process.env.DATABASE_URL;

async function loadPrismaConfig() {
  vi.resetModules();
  return (await import("../../prisma.config")).default;
}

afterEach(() => {
  if (ORIGINAL_DATABASE_URL === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = ORIGINAL_DATABASE_URL;
  }
});

describe("prisma config", () => {
  it("falls back to the documented local database URL when DATABASE_URL is unset", async () => {
    delete process.env.DATABASE_URL;

    const config = await loadPrismaConfig();

    expect(config.datasource?.url).toBe(DEFAULT_DATABASE_URL);
  });

  it("uses DATABASE_URL when one is provided", async () => {
    process.env.DATABASE_URL =
      "postgresql://custom:custom@localhost:5432/custom_db";

    const config = await loadPrismaConfig();

    expect(config.datasource?.url).toBe(process.env.DATABASE_URL);
  });

  it("configures the Prisma seed command for local database bootstrap", async () => {
    const config = await loadPrismaConfig();

    expect(config.migrations?.seed).toBe("tsx prisma/seed.ts");
  });
});
