import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test } from "vitest";

test("globals.css does not include an unlayered button font shorthand reset", () => {
  const stylesheet = readFileSync(
    resolve(process.cwd(), "src/app/globals.css"),
    "utf8",
  );

  expect(stylesheet).not.toMatch(
    /button,\s*input,\s*select,\s*textarea\s*\{[^}]*font:\s*inherit;[^}]*\}/m,
  );
});

test("globals.css defines shared radius tokens for panels and controls", () => {
  const stylesheet = readFileSync(
    resolve(process.cwd(), "src/app/globals.css"),
    "utf8",
  );

  expect(stylesheet).toContain("--radius-panel: 2rem;");
  expect(stylesheet).toContain("--radius-card: 1.25rem;");
  expect(stylesheet).toContain("--radius-control: 0.875rem;");
  expect(stylesheet).toContain("--radius-compact: 0.75rem;");
});
