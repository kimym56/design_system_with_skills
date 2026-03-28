import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, expect, test } from "vitest";

import { loadCliEnv } from "@/lib/load-cli-env";

const TEST_ENV_KEY = "CODEX_TEST_DATABASE_URL";

afterEach(() => {
  delete process.env[TEST_ENV_KEY];
});

test("loads variables from a project .env file outside the Next runtime", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "codex-cli-env-"));
  fs.writeFileSync(
    path.join(tempDir, ".env"),
    `${TEST_ENV_KEY}=postgres://example.test/design-system\n`,
  );

  delete process.env[TEST_ENV_KEY];

  loadCliEnv(tempDir);

  expect(process.env[TEST_ENV_KEY]).toBe("postgres://example.test/design-system");
});
