import "dotenv/config";
import { defineConfig } from "prisma/config";

export const DEFAULT_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/design_system_with_skills";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Client generation should work in a fresh checkout before a local .env exists.
    url: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
  },
});
